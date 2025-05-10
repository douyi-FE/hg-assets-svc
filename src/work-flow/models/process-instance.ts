/**
 * 流程实例状态枚举
 * 定义流程实例在生命周期中的可能状态
 */
export enum ProcessInstanceStatus {
  /** 流程正在执行中 */
  RUNNING = 'running',

  /** 流程被手动暂停或等待外部输入 */
  PAUSED = 'paused',

  /** 流程已正常执行完成 */
  COMPLETED = 'completed',

  /** 流程被手动终止 */
  TERMINATED = 'terminated',
}

/**
 * 流程实例数据模型
 * 描述一个正在运行或历史流程实例的完整状态
 */
export interface ProcessInstance {
  /** 实例唯一标识符 (UUID格式) */
  id: string

  /** 发起人ID */
  initiatorId: string

  /** 关联的流程定义ID */
  instanceId: string

  /** 当前实例状态 */
  status: ProcessInstanceStatus

  /** 引擎状态快照（用于流程恢复） */
  stateSnapshot: object

  /** 当前流程执行节点 */
  flowDesignId: string

  /** 流程变量存储（支持JSON序列化的数据） */
  variables: Record<string, unknown>

  /** 实例创建时间（ISO 8601格式） */
  createdAt: Date

  /** 最后更新时间（可选） */
  updatedAt?: Date

  /** 父实例ID（当本实例是通过恢复操作创建时存在） */
  parentInstanceId?: string

  /** 业务关联ID（可用于关联外部业务数据） */
  businessKey?: string

  /** 实例元数据（扩展属性存储） */
  metadata?: Record<string, unknown>
}

/**
 * 流程实例创建参数
 * 用于启动新流程实例时的参数传递
 */
export type CreateProcessInstanceParams = Pick<
  ProcessInstance,
  'instanceId' | 'variables' | 'businessKey' | 'metadata'
>

/**
 * 流程实例恢复参数
 * 用于从快照恢复流程实例时的参数传递
 */
export interface RestoreProcessInstanceParams {
  /** 原始实例ID */
  originalInstanceId: string

  /** 新实例的初始变量（可选） */
  overrideVariables?: Record<string, unknown>

  /** 是否保留原变量（默认为false） */
  keepOriginalVariables?: boolean
}

/**
 * 流程定义数据模型
 */
export interface ProcessDefinition {
  id: string
  name: string
  bpmnXml: string
  deployedAt: Date
  version?: number
}
