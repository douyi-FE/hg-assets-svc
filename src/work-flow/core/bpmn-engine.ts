import { Instance } from 'bpmn-engine'
import flowDesignCollect from '~/monogdb/models/flow-design'
import { BpmnEngineClass } from './engine'
/**
 * BPMN引擎封装类
 * 封装引擎核心操作并实现事件转发
 */
export class BpmnEngineWrapper {
  // 增加明确的属性类型声明
  private readonly executionCache: Map<string, Instance>

  constructor() {
    this.executionCache = new Map() // 明确初始化
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
      const engine = new BpmnEngineClass(undefined, {
        executionCache: this.executionCache,
      })
      const { execution, info } = await engine.createEngine(flowXml, variables)
      this.executionCache.set(info.instanceId, execution)
      return info
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
  async restoreInstance(instanceId: string, state?: object, tasks?: any[]): Promise<{ instanceId: string, state: any, tasks: any[] }> {
    try {
      // 恢复引擎状态
      const engine = new BpmnEngineClass(undefined, {
        executionCache: this.executionCache,
      })
      const { execution, info } = await engine.restoreInstance(instanceId, state, tasks)
      this.executionCache.set(info.instanceId, execution)
      return info
    }
    catch (error) {
      throw new Error(`恢复失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
