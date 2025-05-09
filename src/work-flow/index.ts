import flowDesignCollect from '~/monogdb/models/flow-design'
import { BpmnEngineWrapper } from './core/bpmn-engine'
import { ProcessInstanceRepository } from './repositories/process-instance.repository'
import { InstanceService } from './services/instance.service'

class WorkFlowService {
  service: InstanceService
  instanceRepo: ProcessInstanceRepository
  constructor() {
    // 初始化核心组件
    const engine = new BpmnEngineWrapper()
    this.instanceRepo = new ProcessInstanceRepository()
    this.service = new InstanceService(engine, this.instanceRepo)
  }

  async initializeFlow() {
    // 初始化流程定义
    const flows: any[] = await flowDesignCollect.find()
    for (const flow of flows) {
      console.log(flow.id, flow.name)
    }
  }

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

  async rejectFlow(instanceId: string) {
    return this.service.endInstance(instanceId)
  }
}

export const workFlowService = new WorkFlowService()
