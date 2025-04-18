import { EventEmitter } from 'node:events'
import { Engine, Instance } from 'bpmn-engine'
import BpmnModdle from 'bpmn-moddle'

/**
 * BPMN引擎封装类
 * 封装引擎核心操作并实现事件转发
 */
export class BpmnEngineWrapper {
  // 增加明确的属性类型声明
  private readonly executionCache: Map<string, Instance>

  constructor() {
    this.executionCache = new Map() // 明确初始化
    const moddle = new BpmnModdle() // 正确创建moddle实例

    this.engine = new Engine({
      name: 'file-engine',
      moddle,
      source: '',
    })

    this.registerEngineHooks()
  }

  // 修正moddle创建方式
  private createModdle() {
    return new BpmnModdle()
  }

  private readonly engine: Engine
  public readonly eventEmitter = new EventEmitter()

  /**
   * 注册引擎事件钩子
   * 将原生事件转换为应用层事件
   */
  private registerEngineHooks(): void {
    this.engine.on('activity.enter', (activity) => {
      this.eventEmitter.emit('activity.enter', {
        instanceId: activity.execution.id,
        activityId: activity.id,
        type: activity.type,
        timestamp: Date.now(),
      })
      this.executionCache.set(activity.execution.id, activity.execution)
    })

    this.engine.on('activity.end', (activity) => {
      this.eventEmitter.emit('activity.end', {
        instanceId: activity.execution.id,
        activityId: activity.id,
        output: activity.output,
        timestamp: Date.now(),
      })
      this.executionCache.delete(activity.execution.id)
    })

    this.engine.on('wait', (activity) => {
      this.eventEmitter.emit('activity.wait', {
        instanceId: activity.execution.id,
        activityId: activity.id,
        message: 'Waiting for external action',
        timestamp: Date.now(),
      })
      activity.execution.suspend()
    })
  }

  /**
   * 创建新流程实例
   * @param bpmnXml BPMN 2.0 XML定义
   * @param variables 初始化变量
   * @returns 实例ID
   */
  async createInstance(bpmnXml: string, variables: Record<string, unknown> = {}): Promise<string> {
    try {
      const definition = await this.engine.define(bpmnXml)
      const instance = await definition.getInstance({ variables })
      await instance.execute()
      return instance.id
    }
    catch (error) {
      throw new Error(`Instance creation failed: ${(error as Error).message}`)
    }
  }

  /**
   * 恢复暂停的实例
   * @param instanceId 目标实例ID
   */
  async resumeInstance(instanceId: string): Promise<void> {
    const instance = this.executionCache.get(instanceId)
      || this.engine.getExecutingInstances().find(i => i.id === instanceId)

    if (instance?.state === 'paused') {
      await instance.resume()
    }
  }

  /**
   * 终止运行中的实例
   * @param instanceId 目标实例ID
   */
  async terminateInstance(instanceId: string): Promise<void> {
    const instance = this.executionCache.get(instanceId)
      || this.engine.getExecutingInstances().find(i => i.id === instanceId)

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
      || this.engine.getExecutingInstances().find(i => i.id === instanceId)

    return instance?.getStateSnapshot() || null
  }

  /**
   * 从快照恢复实例
   * @param bpmnXml 原始BPMN定义
   * @param snapshot 状态快照
   * @returns 新实例ID
   */
  async restoreInstance(bpmnXml: string, snapshot: object): Promise<string> {
    try {
      const definition = await this.engine.define(bpmnXml)
      const instance = await definition.getInstance()
      await instance.resume(snapshot)
      return instance.id
    }
    catch (error) {
      throw new Error(`Restore failed: ${(error as Error).message}`)
    }
  }
}
