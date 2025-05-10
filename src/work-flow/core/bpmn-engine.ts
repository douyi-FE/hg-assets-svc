import { EventEmitter } from 'node:events'
import * as elements from 'bpmn-elements'
import { Engine, Instance } from 'bpmn-engine'
import BpmnModdle from 'bpmn-moddle'
import Serializer, { TypeResolver } from 'moddle-context-serializer'
import { nanoid } from 'nanoid'
import flowDesignCollect from '~/monogdb/models/flow-design'

/**
 * BPMN引擎封装类
 * 封装引擎核心操作并实现事件转发
 */
export class BpmnEngineWrapper {
  // 增加明确的属性类型声明
  private readonly executionCache: Map<string, Instance>
  private engine: Engine
  public readonly eventEmitter = new EventEmitter()

  constructor() {
    this.executionCache = new Map() // 明确初始化
    this.engine = new Engine({
      name: 'add source',
    })
  }

  async getContext(source, options: any = {}) {
    const moddleContext = await this.getModdleContext(source, options)

    if (moddleContext.warnings.length > 0) {
      moddleContext.warnings.forEach(({ error, message, element, property }) => {
        if (error)
          return console.error(message)
        console.error(`<${element.id}> ${property}:`, message)
      })
    }

    const types = TypeResolver({
      ...elements,
      ...options?.elements,
    })

    return Serializer(moddleContext, types, options?.extendFn)
  }

  getModdleContext(source, options): any {
    const bpmnModdle = new BpmnModdle(options)
    return bpmnModdle.fromXML(source)
  }

  /**
   * 注册引擎事件钩子
   * 将原生事件转换为应用层事件
   */
  public registerEngineHooks(): EventEmitter {
    const listener = new EventEmitter()
    listener.on('activity.enter', async (elementApi, engineApi) => {
      // 开始节点自动进入下一节点
      if (elementApi.type === 'bpmn:StartEvent') {
        await engineApi.signal()
      }
      // 结束节点自动结束流程
      else if (elementApi.type === 'bpmn:EndEvent') {
        await engineApi.signal()
      }

      // 获取节点的扩展属性
      const element = elementApi.broker.getState().element
      if (element && element.extensionElements) {
        const properties = element.extensionElements.values.find(el => el.$type === 'camunda:Properties')
        if (properties) {
          console.log('节点属性配置:')
          properties.properties.forEach((prop) => {
            console.log(`  ${prop.name}: ${prop.value}`)
          })
        }
      }
      console.log(`${elementApi.type} <${elementApi.id}> in ${elementApi.name} of ${engineApi.name} is entered`)
    })

    listener.on('activity.wait', (elementApi, instance) => {
      // 获取等待节点的扩展属性
      const element = elementApi.broker.getState().element
      if (element && element.extensionElements) {
        const properties = element.extensionElements.values.find(el => el.$type === 'camunda:Properties')
        if (properties) {
          console.log('等待节点属性配置:')
          properties.properties.forEach((prop) => {
            console.log(`  ${prop.name}: ${prop.value}`)
          })
        }
      }
      console.log(`${elementApi.type} <${elementApi.id}> in ${elementApi.name} of ${instance.name} is waiting for input`)
    })

    listener.on('activity.end', (activity) => {
      console.log(activity.name, 'is ending')
      this.executionCache.delete(activity.executionId)
    })
    return listener
  }

  /**
   * 创建新流程实例
   * @param flowId 流程ID
   * @param variables 初始化变量
   * @returns 实例ID
   */
  async createInstance(flowId: string, variables: Record<string, unknown> = {}): Promise<{ instanceId: string, state: any, tasks: any[] }> {
    try {
      const flow: any = await flowDesignCollect.findById(flowId)
      const flowXml = flow._doc.xml
      const moddleContext = await this.getModdleContext(flowXml, {})
      const sourceContext = await this.getContext(flowXml)
      this.engine.addSource({
        sourceContext,
      })
      const listener = this.registerEngineHooks()
      const executeObj: any = await this.engine.execute({
        variables,
        listener,
      })
      const state = await this.engine.getState()
      const definition: any = await executeObj.definitions[0]
      const instanceId = `${definition.context.id}-${nanoid(16)}`
      this.executionCache.set(instanceId, executeObj)
      const tasks = executeObj.getPostponed().map((task) => {
        const taskExtension = (moddleContext.elementsById[task.id].extensionElements?.values || []).map((el) => {
          const obj = {}
          el.$children.forEach((child) => {
            obj[child.name] = child.value
          })
          return obj
        })
        return { name: task.name, type: task.type, id: task.id, properties: taskExtension }
      })
      return { instanceId, state, tasks }
    }
    catch (error) {
      throw new Error(`实例创建失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * 审批流程
   * @param instanceId 实例ID
   * @returns 审批结果
   */
  async approveInstance(instanceId: string): Promise<{ tasks: { name: string, type: string, id: string }[], state: any, isRunning: boolean }> {
    const executeObj: any = this.executionCache.get(instanceId)
    if (executeObj) {
      if (executeObj.isRunning === false) {
        return {
          tasks: [],
          state: executeObj.getState(),
          isRunning: false,
        }
      }
      else {
        const userTasks = executeObj.getPostponed().filter(activity => activity.type === 'bpmn:UserTask')
        if (userTasks.length > 0) {
          userTasks.forEach((task) => {
            task.signal({
              comment: '审批通过',
            })
          })
          const currentTasks = executeObj.getPostponed().filter(activity => activity.type === 'bpmn:UserTask')
          return {
            tasks: currentTasks.map((task) => {
              const taskExtension = (task.owner.behaviour.extensionElements?.values || []).map((el) => {
                const obj = {}
                el.$children.forEach((child) => {
                  obj[child.name] = child.value
                })
                return obj
              })
              return { name: task.name, type: task.type, id: task.id, properties: taskExtension[0] || {} }
            }),
            state: executeObj.getState(),
            // 如果当前节点有待审批任务，则流程继续运行,否则流程结束
            isRunning: currentTasks.length > 0,
          }
        }
        else {
          return {
            tasks: [],
            state: executeObj.getState(),
            isRunning: true,
          }
        }
      }
    }
    else {
      throw new Error('执行流程不存在')
    }
  }

  /**
   * 获取流程当前执行节点
   */
  getCurrentTasks(instanceId: string): any[] {
    const instance: any = this.executionCache.get(instanceId)
    if (instance) {
      return instance.getPostponed()
    }
    return []
  }

  /**
   * 恢复暂停的实例
   * @param instanceId 目标实例ID
   */
  async resumeInstance(instanceId: string): Promise<void> {
    const instance = this.executionCache.get(instanceId)
    if (instance) {
      await instance.resume()
    }
  }

  /**
   * 终止运行中的实例
   * @param instanceId 目标实例ID
   */
  async terminateInstance(instanceId: string): Promise<void> {
    const instance = this.executionCache.get(instanceId)
    if (instance) {
      await instance.stop()
      this.executionCache.delete(instanceId)
    }
  }

  /**
   * 获取实例状态快照
   * @param instanceId 目标实例ID
   * @returns 状态快照对象
   */
  getStateSnapshot(instanceId: string): object | null {
    const instance = this.executionCache.get(instanceId)
    return instance || null
  }

  /**
   * 从快照恢复实例
   * @param instanceId 实例ID
   * @param state 引擎状态快照
   * @param tasks 待执行任务
   * @returns 新实例ID
   */
  async restoreInstance(instanceId: string, state?: object, tasks?: any[]): Promise<object> {
    try {
      this.engine = new Engine().recover(state)
      const listener = this.registerEngineHooks()
      await this.engine.resume({ listener })
      const executeObj: any = await this.engine.execute()
      // 执行到指定节点
      function goToTask(taskIds: string[]) {
        const tasks = executeObj.getPostponed()
        const task = tasks.find(task => taskIds.includes(task.id))
        if (task === undefined) {
          tasks.forEach((tk) => {
            tk.signal()
          })
        }
        else {
          goToTask(taskIds)
        }
      }
      goToTask(tasks.map(task => task.id))

      this.executionCache.set(instanceId, executeObj)
      const newState = await this.engine.getState()
      return { instanceId, newState }
    }
    catch (error) {
      throw new Error(`恢复失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
