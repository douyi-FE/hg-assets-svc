import {
  type ProcessInstance,
  ProcessInstanceStatus,
  type RestoreProcessInstanceParams,
} from '../models/process-instance'
import { FileStore } from '../storage/file-store'

export class ProcessInstanceRepository {
  private readonly store = new FileStore<ProcessInstance>('instances')

  /** 生成符合规范的实例ID */
  private generateInstanceId(): string {
    return `inst_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  }

  private generateId(): string {
    return `inst_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
  }

  /**
   * 创建新实例（示例）
   */
  async create(instance: Omit<ProcessInstance, 'id'>): Promise<ProcessInstance> {
    const newInstance = {
      ...instance,
      id: this.generateId(),
    }
    return newInstance
  }

  async findById(id: string): Promise<ProcessInstance | undefined> {
    return this.store.findById(id)
  }

  async findAllActive(): Promise<ProcessInstance[]> {
    const all = await this.store.findAll()
    return all.filter(i =>
      i.status === 'running' || i.status === 'paused',
    )
  }

  /**
   * 从现有实例恢复新实例
   * @param params 恢复参数
   * @returns 新实例对象
   */
  async restore(params: RestoreProcessInstanceParams): Promise<ProcessInstance> {
    const original = await this.store.findById(params.originalInstanceId)
    if (!original)
      throw new Error('Original instance not found')

    // 生成新实例对象
    const newInstance: ProcessInstance = {
      ...original,
      id: this.generateInstanceId(), // 必须生成新ID
      parentInstanceId: original.id,
      status: ProcessInstanceStatus.RUNNING,
      createdAt: new Date(),
      variables: params.keepOriginalVariables
        ? original.variables
        : { ...original.variables, ...params.overrideVariables },
    }

    // 正确调用方式：单参数传递完整对象
    await this.store.save(newInstance) // 只传一个参数

    return newInstance
  }

  /**
   * 删除指定实例
   */
  async delete(id: string): Promise<void> {
    await this.store.delete(id)
  }
}
