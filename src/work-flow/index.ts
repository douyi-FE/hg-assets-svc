import { BpmnEngineWrapper } from './core/bpmn-engine'
import { ProcessDefinitionRepository } from './repositories/process-definition.repository'
import { ProcessInstanceRepository } from './repositories/process-instance.repository'
import { InstanceService } from './services/instance.service'

/**
 * 系统初始化流程
 */
export async function initializeFlow(name: string, xml: string) {
  // 初始化核心组件
  const engine = new BpmnEngineWrapper()
  const definitionRepo = new ProcessDefinitionRepository()
  const instanceRepo = new ProcessInstanceRepository()
  const instanceService = new InstanceService(engine, definitionRepo, instanceRepo)

  // 注册事件监听
  engine.eventEmitter.on('activity.wait', (event) => {
    console.log(`[${event.timestamp}] 流程暂停在节点 ${event.activityId}`)
    console.log('执行下一步命令: npm run resume --', event.instanceId)
  })

  // 示例：部署并运行流程
  try {
    // 正确调用创建方法
    const definition = await definitionRepo.create({
      deployedAt: new Date(),
      name,
      bpmnXml: xml,
    })

    // 启动实例（现在可以正确获取id）
    const instanceId = await instanceService.startInstance(definition.id, {
      orderId: 1001,
      items: ['product-a', 'product-b'],
    })

    console.log('流程实例已启动:', instanceId)
  }
  catch (error) {
    console.error('系统初始化失败:', error)
    process.exit(1)
  }
}

// // 启动系统
// bootstrap('订单处理流程', `<?xml version="1.0" encoding="UTF-8"?>
//         <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL">
//           <bpmn:process id="Process_1" />
//         </bpmn:definitions>`).catch(console.error)
