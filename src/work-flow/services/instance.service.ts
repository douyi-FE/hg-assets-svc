import type { ProcessInstanceRepository } from '../repositories//process-instance.repository'
import { nanoid } from 'nanoid'
import { BpmnEngineWrapper } from '../core/bpmn-engine'
import { ProcessInstanceStatus } from '../models/process-instance'

/**
 * 流程实例管理服务
 * 处理实例的启动、恢复和监控
 */
export class InstanceService {
  constructor(
    private readonly engine: BpmnEngineWrapper,
    private readonly instances: ProcessInstanceRepository,
  ) {}

  /**
   * 启动新流程实例（修复版）
   * 修复了 instanceId 使用顺序问题
   */
  async startInstance(flowId: string, variables: Record<string, unknown> = {}, initiatorId: string = '') {
    try {
      // 创建引擎实例
      const { instanceId, state } = await this.engine.createInstance(
        flowId,
        this.sanitizeVariables(variables),
      )

      return {
        id: nanoid(16),
        stateSnapshot: state,
        flowDesignId: flowId,
        processDefinitionId: instanceId,
        initiatorId,
        variables: this.sanitizeVariables(variables),
        status: ProcessInstanceStatus.RUNNING,
      }
    }
    catch (error) {
      throw new Error(`Failed to start instance: ${(error as Error).message}`)
    }
  }

  /**
   * 审批流程
   * @param instanceId 实例ID
   * @returns 审批结果
   */
  async approveInstance(instanceId: string) {
    return this.engine.approveInstance(instanceId)
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

    try {
      // 使用安全克隆方法
      const state = instance.stateSnapshot
      await this.engine.restoreInstance(state)
    }
    catch (error) {
      throw new Error(`Resume failed: ${(error as Error).message}`)
    }
  }

  /**
   * 结束指定流程实例
   */
  async endInstance(instanceId: string) {
    // 删除示例引擎
    await this.engine.terminateInstance(instanceId)
  }
}
