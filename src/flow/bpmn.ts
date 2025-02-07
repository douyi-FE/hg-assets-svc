import EventEmitter from 'node:events'
import { Engine } from 'bpmn-engine'
import BpmnModdle from 'bpmn-moddle'
import { uniqueId } from 'lodash'

const processMap = new Map<string, Engine>()

/**
 * 获取流程引擎
 * @param processId 流程id
 * @returns
 */
export function getProcessEngine(processId: string) {
  if (processMap.has(processId)) {
    return processMap.get(processId)
  }
}

/**
 * 创建流程引擎
 * @param bpmnXml bpmn xml
 */
export function createProcessEngine(bpmnXml: string) {
  const processId = uniqueId()
  const moddle = new BpmnModdle()
  moddle.fromXML(bpmnXml, (err, rootElement) => {
    if (err) {
      console.error(err)
    }
    else {
      const engine = new Engine({
        name: processId,
        source: bpmnXml,
      })
      const listener = new EventEmitter()
      engine.execute({
        listener,
        variables: {
          aa: {},
        },
      }, (err, execution) => {
        if (err) {
          return console.error(err)
        }

        processMap.set(processId, engine)

        listener.on('activity.end', (activity) => {
          console.log(`Activity ${activity.id} ended`)

          if (activity.id === 'RequestLeave') {
            return { message: 'Leave request submitted', processId }
          }
          else if (activity.id === 'LeaveApproved') {
            console.log('Leave approved')
          }
          else if (activity.id === 'LeaveRejected') {
            console.log('Leave rejected')
          }
          else if (activity.id === 'DelegateApproval') {
            console.log('Leave approval delegated')
          }
        })

        listener.once('end', () => {
          console.log(`Leave process ${processId} completed`)
          processMap.delete(processId)
        })
      })
    }
  })
}

/**
 * 执行流程
 * @param processId 流程id
 * @param variables 变量
 */
export function executeProcess(processId: string, variables: Record<string, any>) {
  const engine = getProcessEngine(processId)
  if (!engine) {
    return
  }
  const listener = new EventEmitter()
  engine.resume({ listener, variables }, (err, execution) => {
    if (err) {
      return console.error(err)
    }
    listener.on('activity.end', (activity) => {
      console.log(`Activity ${activity.id} ended`)
      if (activity.id === 'LeaveApproved') {
        return { message: 'Leave approved', processId }
      }
      else if (activity.id === 'LeaveRejected') {
        return { message: 'Leave rejected', processId }
      }
      else if (activity.id === 'DelegateApproval') {
        return { message: 'Leave approval delegated', processId }
      }
    })
    listener.once('end', () => {
      console.log(`Leave process ${processId} completed`)
      processMap.delete(processId)
    })
  })
}
