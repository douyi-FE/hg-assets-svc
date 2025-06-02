import { EventEmitter } from 'node:events'
import * as elements from 'bpmn-elements'
import { Engine } from 'bpmn-engine'
import BpmnModdle from 'bpmn-moddle'
import Serializer, { TypeResolver } from 'moddle-context-serializer'
import { nanoid } from 'nanoid'

export class BpmnEngineClass {
  private engine: Engine
  private props: any

  constructor(name: string = 'flow-engine', props: any = {}) {
    this.engine = new Engine({
      name,
    })
    this.props = props
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
          properties.properties.forEach((prop) => {
            console.log(`  ${prop.name}: ${prop.value}`)
          })
        }
      }
      console.log(`${elementApi.type} <${elementApi.id}> in ${elementApi.name} of ${instance.name} is waiting for input`)
    })

    listener.on('activity.end', (activity) => {
      this.props.executionCache.delete(activity.executionId)
    })
    return listener
  }

  /**
   * 获取moddle上下文
   * @param source 流程定义XML
   * @param options 选项
   * @returns moddle上下文
   */
  getModdleContext(source, options): any {
    const bpmnModdle = new BpmnModdle(options)
    return bpmnModdle.fromXML(source)
  }

  /**
   * 获取上下文
   * @param source 流程定义XML
   * @param options 选项
   * @returns 上下文
   */
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

  /**
   * 创建引擎实例
   * @param xml 流程定义XML
   * @param variables 初始化变量
   * @returns 引擎实例信息
   */
  async createEngine(xml: string, variables: Record<string, unknown> = {}): Promise<{ execution: any, info: { instanceId: string, state: any, tasks: any[] } }> {
    const moddleContext = await this.getModdleContext(xml, {})
    const sourceContext = await this.getContext(xml)
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
    // 返回引擎实例信息
    return {
      execution: executeObj,
      info: {
        instanceId,
        state,
        tasks,
      },
    }
  }

  /**
   * 从快照恢复实例
   * @param instanceId 实例ID
   * @param state 引擎状态快照
   * @param tasks 待执行任务
   * @returns 新实例ID
   */
  async restoreInstance(instanceId: string, state?: object, tasks?: any[]): Promise<{ execution: any, info: { instanceId: string, state: any, tasks: any[] } }> {
    try {
      // 恢复引擎状态
      this.engine = new Engine().recover(state)
      const listener = this.registerEngineHooks()
      // 执行流程并获取执行实例
      const execution: any = await this.engine.execute({ listener })
      // 获取目标节点ID
      const targetIds = tasks.map(t => t.id)
      // 使用轮询机制检查是否到达目标节点
      const maxAttempts = 100 // 最大尝试次数
      let attempts = 0

      while (attempts < maxAttempts) {
        // 获取当前被推迟的任务
        const postponed = execution.getPostponed()
        // 检查是否到达任何目标节点
        const reachedTarget = postponed.some(t => targetIds.includes(t.id))
        if (reachedTarget)
          break
        // 如果未到达目标节点，通过触发所有等待任务来推进流程
        if (postponed.length > 0) {
          // 正确方式：使用 BpmnMessage 对象触发任务
          postponed.forEach((task) => {
            execution.signal({
              id: task.id, // 必需：任务ID
              name: task.name, // 可选：任务名称
              type: task.type, // 可选：任务类型
              data: {}, // 可选：附加数据
            })
          })
        }
        else {
          // 如果没有等待任务，说明流程可能已完成或卡住
          throw new Error('流程已结束，无法到达目标节点')
        }
        attempts++
        // 添加短暂延迟，让引擎处理信号
        await new Promise(resolve => setTimeout(resolve, 10))
      }
      if (attempts === maxAttempts) {
        throw new Error(`在 ${maxAttempts} 次尝试后未到达目标节点`)
      }
      // 缓存并返回新状态
      const newState = await this.engine.getState()
      return {
        execution,
        info: {
          instanceId,
          state: newState,
          tasks,
        },
      }
    }
    catch (error) {
      throw new Error(`恢复失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
