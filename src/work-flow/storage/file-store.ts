import fs from 'node:fs/promises'
import path from 'node:path'
import { LRUCache } from 'lru-cache'
import lockfile from 'proper-lockfile'

/**
 * 通用文件存储抽象层
 * 实现带缓存和文件锁的原子操作
 */
export class FileStore<T extends { id: string }> {
  private readonly storagePath: string
  private readonly cache: LRUCache<string, T>
  private readonly lockOptions = {
    retries: 3, // 失败重试次数
    stale: 5000, // 锁失效时间（毫秒）
  }

  constructor(storageType: 'definitions' | 'instances') {
    this.storagePath = path.resolve(__dirname, `./storage/${storageType}`)
    this.cache = new LRUCache<string, T>({
      max: 100, // 最大缓存条目
      ttl: 60_000, // 缓存有效期（毫秒）
    })
    this.initializeStorage()
  }

  /**
   * 初始化存储目录
   */
  private async initializeStorage(): Promise<void> {
    try {
      await fs.access(this.storagePath)
    }
    catch {
      await fs.mkdir(this.storagePath, { recursive: true })
    }
  }

  /**
   * 保存实体（修正后）
   * @param entity 包含id属性的完整实体对象
   */
  async save(entity: T): Promise<void> {
    try {
      await fs.access(this.storagePath)
    }
    catch {
      await fs.mkdir(this.storagePath, { recursive: true })
    }
    const filePath = path.join(this.storagePath, `${entity.id}.json`)

    // 确保文件存在
    try {
      await fs.access(filePath)
    }
    catch {
      await fs.writeFile(filePath, '{}')
    }

    const release = await lockfile.lock(filePath)

    try {
      const data = JSON.stringify(entity, null, 2)
      await fs.writeFile(filePath, data)
      this.cache.set(entity.id, entity)
    }
    finally {
      await release()
    }
  }

  /**
   * 查找实体（带缓存）
   * @param id 实体ID
   * @returns 实体对象或undefined
   */
  async findById(id: string): Promise<T | undefined> {
    // 优先从缓存获取
    const cached = this.cache.get(id)
    if (cached)
      return cached

    try {
      const filePath = path.join(this.storagePath, `${id}.json`)
      const data = await fs.readFile(filePath, 'utf-8')
      const entity = JSON.parse(data) as T

      // 验证数据完整性
      if (!entity.id || entity.id !== id) {
        await this.delete(id)
        return undefined
      }

      this.cache.set(id, entity)
      return entity
    }
    catch {
      return undefined
    }
  }

  async findAll(): Promise<T[]> {
    try {
      const files = await fs.readdir(this.storagePath)
      const entities = await Promise.all(
        files
          .filter(file => file.endsWith('.json'))
          .map(async (file) => {
            const id = file.replace(/\.json$/, '')
            return this.findById(id)
          }),
      )
      // 修正类型断言
      return entities.filter(e => !!e)
    }
    catch {
      return []
    }
  }

  /**
   * 删除实体
   * @param id 实体ID
   */
  async delete(id: string): Promise<boolean> {
    try {
      const filePath = path.join(this.storagePath, `${id}.json`)
      await fs.unlink(filePath)
      this.cache.delete(id)
      return true
    }
    catch {
      return false
    }
  }
}
