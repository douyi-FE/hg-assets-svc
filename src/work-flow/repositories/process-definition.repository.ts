import type { ProcessDefinition } from '../models/process-instance'
import { FileStore } from '../storage/file-store'

export class ProcessDefinitionRepository {
  private store = new FileStore<ProcessDefinition>('definitions')
  /**
   * 生成定义ID
   */
  private generateDefinitionId(): string {
    return `def_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
  }

  /**
   * 查找定义
   * @param id 定义ID
   */
  async findById(id: string): Promise<ProcessDefinition | undefined> {
    return this.store.findById(id)
  }

  /**
   * 创建并保存新定义
   * @param params 定义参数（不包含id）
   */
  async create(params: Omit<ProcessDefinition, 'id'>): Promise<ProcessDefinition> {
    const newDefinition: ProcessDefinition = {
      ...params,
      id: this.generateDefinitionId(),
      deployedAt: new Date(),
    }

    await this.store.save(newDefinition)
    return newDefinition
  }

  // 修正保存方法
  async save(definition: ProcessDefinition): Promise<void> {
    await this.store.save(definition)
  }

  async findAll(): Promise<ProcessDefinition[]> {
    return this.store.findAll()
  }

  // 添加版本控制示例方法
  async createNewVersion(bpmnXml: string, name: string) {
    const definitions = await this.findAll()
    const latestVersion = Math.max(...definitions.map(d => d.version || 0))

    const newDef: ProcessDefinition = {
      id: `def_${Date.now()}`,
      name,
      bpmnXml,
      deployedAt: new Date(),
      version: latestVersion + 1,
    }

    await this.save(newDef)
    return newDef
  }
}
