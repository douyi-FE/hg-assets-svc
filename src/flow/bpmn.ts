import EventEmitter from 'node:events'
import { Engine } from 'bpmn-engine'
import BpmnModdle from 'bpmn-moddle'
import { v4 as uuidv4 } from 'uuid'

const engineMap = new Map<string, Engine>()

// 定义节点状态类型
export type ProcessNodeStatus =
  | 'created' // 节点已创建但未开始
  | 'waiting' // 节点等待执行（例如等待用户输入）
  | 'started' // 节点开始执行
  | 'suspended' // 节点被暂停
  | 'completed' // 节点已完成
  | 'terminated' // 节点被终止
  | 'error' // 节点执行出错

// 定义节点信息接口
export interface ProcessNodeInfo {
  id: string
  name: string
  type: string
  status: ProcessNodeStatus
  startTime: Date
  variables?: Record<string, any>
}

/**
 * 创建流程引擎
 * @param bpmnXml bpmn xml
 * @param engineId 引擎ID，用于复用已存在的引擎实例
 * @param currentNodeId 目标节点ID，流程会执行到此节点
 * @returns Promise<{engine: Engine, currentNode: ProcessNodeInfo | null}>
 */
export function createProcessEngine(
  bpmnXml: string,
  engineId?: string,
  currentNodeId?: string,
): Promise<{
    engine: Engine
    processId: string
    currentNode: ProcessNodeInfo | null
  }> {
  return new Promise((resolve, reject) => {
    // 1. 检查是否存在可复用的引擎实例
    if (engineId) {
      const engine = engineMap.get(engineId)
      if (engine) {
        resolve({
          engine,
          processId: engineId,
          currentNode: getCurrentProcessNode(engine),
        })
        return
      }
    }

    engineId = engineId || uuidv4()

    // 2. 验证 XML 基本结构
    if (!bpmnXml.includes('<?xml') || !bpmnXml.includes('</bpmn2:definitions>')) {
      console.error('BPMN XML 格式不完整:', bpmnXml)
      reject(new Error('BPMN XML 格式不完整'))
      return
    }

    try {
      const moddle = new BpmnModdle()
      moddle.fromXML(bpmnXml, {
        strict: false,
      }).then(async (rootElement: any) => {
        const engine = new Engine({
          name: 'bpmn-engine',
          source: bpmnXml,
        })

        const listener = new EventEmitter()
        let currentNode: ProcessNodeInfo | null = null

        // 监听任务等待事件
        listener.on('activity.wait', (elementApi) => {
          console.log('等待任务:', elementApi.id, elementApi.type, elementApi.name)
          if (currentNodeId && elementApi.id === currentNodeId) {
            currentNode = {
              id: elementApi.id,
              name: elementApi.name || '',
              type: elementApi.type,
              status: 'waiting',
              startTime: new Date(),
              variables: elementApi.content?.variables || {},
            }
          }
        })

        // 监听任务开始事件
        listener.on('activity.start', (elementApi) => {
          console.log('开始活动:', elementApi.id, elementApi.type, elementApi.name)
          if (!currentNodeId && !currentNode && elementApi.type.includes('Task')) {
            currentNode = {
              id: elementApi.id,
              name: elementApi.name || '',
              type: elementApi.type,
              status: 'started',
              startTime: new Date(),
              variables: elementApi.content?.variables || {},
            }
          }
        })

        // 监听任务结束事件
        listener.on('activity.end', (elementApi) => {
          console.log('结束活动:', elementApi.id, elementApi.type, elementApi.name)
          if (currentNode && currentNode.id === elementApi.id) {
            currentNode.status = 'completed'
          }
          // 如果当前节点不是目标节点，继续执行
          if (currentNodeId && elementApi.id !== currentNodeId) {
            const execution = engine.execution
            if (execution) {
              execution.signal({
                id: elementApi.id,
              })
            }
          }
        })

        // 监听错误事件
        listener.on('activity.error', (elementApi, error) => {
          console.error('任务执行出错:', elementApi.id, error)
          if (currentNode && currentNode.id === elementApi.id) {
            currentNode.status = 'error'
          }
        })

        // 启动流程实例
        await engine.execute({
          listener,
        })

        // 存储引擎实例
        engineMap.set(engineId, engine)

        // 返回引擎和当前节点信息
        resolve({
          engine,
          processId: engineId,
          currentNode: currentNode || getCurrentProcessNode(engine),
        })
      }).catch((err) => {
        console.error('BPMN XML 解析错误:', err)
        reject(err)
      })
    }
    catch (error) {
      console.error('BPMN XML 解析同步错误:', error)
      reject(error)
    }
  })
}

/**
 * 执行流程当前任务的下一个任务
 * @param engine 流程引擎实例
 * @param taskId 当前任务ID
 * @returns Promise<{finished: boolean}> - finished 表示是否到达结束节点
 */
export function executeProcessNextNode(engine: Engine, taskId: string): Promise<{ finished: boolean }> {
  return new Promise((resolve, reject) => {
    try {
      // 获取当前任务状态
      const execution = engine.execution
      if (!execution) {
        reject(new Error('流程未在执行中'))
        return
      }
      const currentTask = execution.getActivityById(taskId)
      if (!currentTask) {
        reject(new Error(`找不到任务: ${taskId}`))
        return
      }
      // 创建事件监听器
      const listener = new EventEmitter()
      // 监听下一个任务的开始
      listener.once('activity.start', (elementApi) => {
        console.log('进入下一个任务:', elementApi.id, elementApi.type, elementApi.name)
        resolve({ finished: false })
      })
      // 监听流程结束事件
      listener.once('end', () => {
        console.log('流程已结束')
        resolve({ finished: true })
      })
      // 监听错误
      listener.once('error', (error) => {
        reject(error)
      })
      // 发送信号让当前任务继续执行
      execution.signal({
        id: taskId,
        listener,
      })
    }
    catch (error) {
      reject(error)
    }
  })
}

/**
 * 获取当前流程执行任务节点信息
 */
export function getCurrentProcessNode(engine: Engine): ProcessNodeInfo | null {
  try {
    // 1. 检查引擎实例
    if (!engine) {
      console.warn('引擎实例不存在')
      return null
    }

    // 2. 检查执行实例
    const execution = engine.execution
    if (!execution) {
      console.warn('流程未在执行中')
      return null
    }

    // 3. 检查流程状态
    if (!execution.isRunning) {
      console.warn('流程未运行')
      return null
    }

    // 4. 获取所有等待中的任务
    const postponed = execution.getPostponed()
    if (!postponed || postponed.length === 0) {
      // 检查是否已结束
      if (execution.activityStatus === 'idle') {
        console.warn('流程已结束')
        return null
      }
      console.warn('没有等待中的任务')
      return null
    }

    // 5. 获取当前活动的任务（第一个等待中的任务）
    const currentTask = postponed[0]
    if (!currentTask || !currentTask.id) {
      console.warn('当前任务信息不完整')
      return null
    }

    // 6. 构建返回数据
    return {
      id: currentTask.id,
      name: currentTask.name || '未命名任务',
      type: currentTask.type,
      status: mapEngineStatusToNodeStatus(execution.activityStatus),
      startTime: new Date(),
      variables: currentTask.content?.variables || {},
    }
  }
  catch (error) {
    console.error('获取当前任务节点信息失败:', error)
    return null
  }
}

/**
 * 将引擎状态映射到节点状态
 */
function mapEngineStatusToNodeStatus(engineStatus: 'idle' | 'executing' | 'timer' | 'wait'): ProcessNodeStatus {
  switch (engineStatus) {
    case 'executing':
      return 'started'
    case 'wait':
      return 'waiting'
    case 'timer':
      return 'waiting'
    case 'idle':
      return 'completed'
    default:
      return 'created'
  }
}

// 获取流程所有环节数据
/**
 * 流程节点类型
 */
export interface ProcessNode {
  id: string
  name: string
  type: string
  incoming: string[] // 入边ID
  outgoing: string[] // 出边ID
}

/**
 * 流程连线类型
 */
export interface ProcessFlow {
  id: string
  sourceRef: string // 起点节点ID
  targetRef: string // 终点节点ID
}

/**
 * 获取流程所有环节数据
 * @param engine 流程引擎实例
 * @returns 所有节点和连线数据
 */
export async function getProcessAllNodes(processId: string): Promise<{
  nodes: ProcessNode[]
  flows: ProcessFlow[]
} | null> {
  try {
    // 1. 检查引擎实例
    const engine = engineMap.get(processId)
    if (!engine) {
      console.warn('引擎实例不存在')
      return null
    }

    // 2. 检查执行实例
    const execution = engine.execution
    if (!execution) {
      console.warn('流程未在执行中')
      return null
    }

    // 3. 获取流程定义
    const definitions = await engine.getDefinitions()
    if (!definitions || definitions.length === 0) {
      console.warn('未找到流程定义')
      return null
    }

    const nodes: ProcessNode[] = []
    const flows: ProcessFlow[] = []

    // 4. 遍历所有节点和连线
    definitions.forEach((definition) => {
      const processes = definition.getProcesses()
      processes.forEach((process: any) => {
        // 获取流程中的所有元素
        const elements = process.flowElements || []
        elements.forEach((element: any) => {
          // 处理节点（排除连线）
          if (element.$type && element.$type.startsWith('bpmn:') && element.$type !== 'bpmn:SequenceFlow') {
            nodes.push({
              id: element.id,
              name: element.name || '',
              type: element.$type,
              incoming: (element.incoming || []).map((ref: string) => ref),
              outgoing: (element.outgoing || []).map((ref: string) => ref),
            })
          }
          // 处理连线
          else if (element.$type === 'bpmn:SequenceFlow') {
            flows.push({
              id: element.id,
              sourceRef: element.sourceRef,
              targetRef: element.targetRef,
            })
          }
        })
      })
    })

    // 5. 数据校验
    if (nodes.length === 0) {
      console.warn('未找到任何节点')
      return null
    }

    // 6. 按节点类型和连接关系排序
    nodes.sort((a, b) => {
      // 首先按类型排序
      if (a.type.includes('StartEvent'))
        return -1
      if (b.type.includes('StartEvent'))
        return 1
      if (a.type.includes('EndEvent'))
        return 1
      if (b.type.includes('EndEvent'))
        return -1

      // 然后按连接关系排序
      const aOutRefs = flows.filter(f => f.sourceRef === a.id).map(f => f.targetRef)
      const bInRefs = flows.filter(f => f.targetRef === b.id).map(f => f.sourceRef)
      if (aOutRefs.includes(b.id))
        return -1
      if (bInRefs.includes(a.id))
        return 1

      return 0
    })

    return {
      nodes,
      flows,
    }
  }
  catch (error) {
    console.error('获取流程所有环节数据失败:', error)
    return null
  }
}
