import { Injectable } from '@nestjs/common'
import ApplicationCollect from '~/monogdb/models/application'

@Injectable()
export class ApplicationService {
  constructor() {}

  // 获取应用列表
  async getApplication(parmas) {
    const application = await ApplicationCollect.find(parmas)
    return application.map((item: any) => ({ ...item._doc, _id: item._id.buffer.toString('hex') }))
  }

  // 获取应用详情
  async getApplicationById(id: string) {
    const application = await ApplicationCollect.findOne({ templateId: id })
    if (!application) {
      throw new Error('应用不存在')
    }
    return { ...application.toObject(), _id: application._id.toString() }
  }

  // 依据id更新应用
  async updateApplicationById(id: string, application: any) {
    return ApplicationCollect.updateOne({ templateId: id }, { $set: { content: application.content } })
  }

  // 新增应用
  async addApplication(application: any) {
    return ApplicationCollect.create(application)
  }

  // 更新应用
  async updateApplication(application: any) {
    await ApplicationCollect.deleteMany({})
    return ApplicationCollect.create(application)
  }

  // 发布应用
  async publishApplication(application: any) {
    try {
      const result = await ApplicationCollect.findOne({ templateId: application.templateId }).exec()

      if (result) {
        return await ApplicationCollect.updateOne(
          { templateId: application.templateId },
          {
            $set: {
              name: application.name,
              icon: application.icon,
              description: application.description,
              content: application.content,
              updateTime: new Date(),
            },
          },
        ).exec().then((res) => {
          return 'success'
        })
      }
      else {
        return await ApplicationCollect.create({
          ...application,
          updateTime: new Date(),
        }).then(() => 'success')
      }
    }
    catch (error) {
      console.error('发布应用失败:', error)
      throw error
    }
  }
}
