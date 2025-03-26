import InvoiceCollect from '~/monogdb/models/invoice'

async function getAllFlowApprovalApply() {
  const allFlowApprovalApply = [
    InvoiceCollect.find({ status: 'pending' }).exec(),
  ]
  const results = await Promise.all(allFlowApprovalApply)
  return results.flatMap(item => item.map(item => item.toObject()))
}

// 初始化所有流程
export async function initAllFlowApprovalApply() {
  const allFlowApprovalApply = await getAllFlowApprovalApply()
  console.log('allFlowApprovalApply', allFlowApprovalApply)
  allFlowApprovalApply.forEach(async (item) => {
    const { processId, taskId, applyCode } = item
    // const bpmnXml = await flowDesignCollect.findOne({ _id: processId }).exec()
    // const { nodes, flows } = await createProcessEngine(item.bpmnXml, item.processId)
    // console.log('nodes', nodes)
    // console.log('flows', flows)
  })
}
