import type { ProcessInstanceRepository } from '../repositories//process-instance.repository'
import type { ProcessDefinitionRepository } from '../repositories/process-definition.repository'
import { BpmnEngineWrapper } from '../core/bpmn-engine'
import { ProcessInstanceStatus } from '../models/process-instance'

/**
 * 流程实例管理服务
 * 处理实例的启动、恢复和监控
 */
export class InstanceService {
  constructor(
    private readonly engine: BpmnEngineWrapper,
    private readonly definitions: ProcessDefinitionRepository,
    private readonly instances: ProcessInstanceRepository,
  ) {}

  // 在服务层添加克隆方法
  private deepClone(obj: object): object {
    return JSON.parse(JSON.stringify(obj))
  }

  /**
   * 启动新流程实例（修复版）
   * 修复了 instanceId 使用顺序问题
   */
  async startInstance(definitionId: string, variables: Record<string, unknown> = {}) {
    const definition = await this.definitions.findById(definitionId)
    if (!definition) {
      throw new Error('Process definition not found')
    }

    try {
      // 第一步：创建引擎实例
      const instanceId = await this.engine.createInstance(
        definition.bpmnXml,
        this.sanitizeVariables(variables),
      )

      // 第二步：获取状态快照（此时instanceId已定义）
      const snapshot = this.deepClone(
        this.engine.getStateSnapshot(instanceId),
      )

      // 第三步：持久化存储
      await this.instances.save({
        id: instanceId,
        processDefinitionId: definitionId,
        variables: this.sanitizeVariables(variables),
        stateSnapshot: snapshot, // 使用正确的克隆方法
        status: ProcessInstanceStatus.RUNNING,
        createdAt: new Date(),
      })

      return instanceId
    }
    catch (error) {
      throw new Error(`Failed to start instance: ${(error as Error).message}`)
    }
  }

  /**
   * 安全处理流程变量
   * 移除不可序列化的属性
   */
  private sanitizeVariables(variables: Record<string, unknown>): Record<string, unknown> {
    return JSON.parse(JSON.stringify(variables))
  }

  /**
   * 恢复实例（兼容性修复）
   */
  async resumeInstance(instanceId: string) {
    const instance = await this.instances.findById(instanceId)
    if (!instance) {
      throw new Error('Instance not found')
    }

    const definition = await this.definitions.findById(instance.processDefinitionId)
    if (!definition) {
      throw new Error('Process definition not found')
    }

    try {
      // 使用安全克隆方法
      const cleanSnapshot = this.deepClone(instance.stateSnapshot)

      const newInstanceId = await this.engine.restoreInstance(
        definition.bpmnXml,
        cleanSnapshot,
      )

      await this.instances.save({
        ...instance,
        id: newInstanceId,
        parentInstanceId: instanceId,
        status: ProcessInstanceStatus.RUNNING,
        updatedAt: new Date(),
      })

      return newInstanceId
    }
    catch (error) {
      throw new Error(`Resume failed: ${(error as Error).message}`)
    }
  }
}
