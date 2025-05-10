import FlowExecuteCollect from '~/monogdb/models/flow-execute'
import { BpmnEngineWrapper } from './core/bpmn-engine'
import { InstanceService } from './services/instance.service'

class WorkFlowService {
  service: InstanceService
  constructor() {
    // 初始化核心组件
    const engine = new BpmnEngineWrapper()
    this.service = new InstanceService(engine)
  }

  /**
   * 初始化流程定义
   * @returns 流程定义
   */
  async initializeFlow() {
    // 初始化流程定义
    const instances: any[] = await FlowExecuteCollect.find()
    for (const instance of instances) {
      this.service.resumeInstance(instance)
    }
  }

  /**
   * 创建流程实例
   * @param flowId 流程ID
   * @param variables 流程变量
   * @param initiatorId 发起人ID
   * @returns 实例ID
   */
  async createFlow(flowId: string, variables: any = {}, initiatorId?: string) {
    // 示例：部署并运行流程
    try {
      // 启动实例（现在可以正确获取id）
      return this.service.startInstance(flowId, variables, initiatorId)
    }
    catch (error) {
      return error.message
    }
  }

  /**
   * 审批流程,执行下一个节点
   * @param instanceId 实例ID
   * @returns 审批结果
   */
  async approveFlow(instanceId: string) {
    return this.service.approveInstance(instanceId)
  }

  /**
   * 驳回流程,结束流程
   * @param instanceId 实例ID
   * @returns 驳回结果
   */
  async rejectFlow(instanceId: string) {
    return this.service.endInstance(instanceId)
  }

  /**
   * 获取当前流程实例的待执行任务
   * @param instanceId 实例ID
   * @returns 待执行任务
   */
  async getCurrentTasks(instanceId: string) {
    return this.service.getCurrentTasks(instanceId)
  }
}

export const workFlowService = new WorkFlowService()
