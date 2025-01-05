import { BadRequestException, Body, Injectable } from '@nestjs/common'
import TemplateCollect from '~/monogdb/models/template'
import TemplateVersionCollect from '~/monogdb/models/template-version'

@Injectable()
export class TemplateVersionService {
  constructor() {}

  // 版本相关
  async list(parmas) {
    const list = await TemplateVersionCollect.find(parmas)
    const formattedList = list.map((item: any) => {
      return {
        createdAt: item._doc.createdAt,
        _id: item._id.buffer.toString('hex'),
        note: item._doc.note,
        version: item._doc.version,
        status: item._doc.status,
        type: item._doc.type,
      }
    })
    return formattedList
  }

  // 版本保存
  async save(body) {
    const { templateId, note, file, type } = body

    // 查找当前最大版本号
    const maxVersionDoc = await TemplateVersionCollect.findOne(
      { templateId, type },
      { version: 1 },
      { sort: { version: -1 } }, // 按版本号降序排序
    )

    // 计算新版本号
    let newVersion = 'v1'
    if (maxVersionDoc) {
      const currentMaxVersion = Number.parseInt(maxVersionDoc.version.substring(1))
      newVersion = `v${currentMaxVersion + 1}`
    }

    // 更新其他所有版本状态
    await TemplateVersionCollect.updateMany(
      {},
      { status: 1 },
    )

    // 创建新版本
    const result = await TemplateVersionCollect.create({
      templateId,
      note,
      file,
      version: newVersion,
      status: 2,
      type,
    })

    return result
  }

  // 版本更新
  async update(body) {
    const { id, status } = body

    // 先更新指定 id 的文档
    await TemplateVersionCollect.updateOne(
      { _id: id },
      { status },
    )

    // 更新其他所有不匹配该 id 的文档
    const result = await TemplateVersionCollect.updateMany(
      { _id: { $ne: id } },
      { status: 1 }, // 这里设置其他文档的 status 为 1
    )

    return result
  }

  // 版本删除
  async delete(id: string) {
    const result = await TemplateVersionCollect.deleteOne({ _id: id })
    return result
  }

  // 获取模板版本
  async getTemplateVersion(id: string) {
    const templateVersion = await TemplateVersionCollect.find({ _id: id })
    if (templateVersion.length === 0) {
      throw new BadRequestException('模板版本不存在')
    }
    else {
      return {
        file: (templateVersion[0] as any)._doc.file,
        id: (templateVersion[0] as any)._id.buffer.toString('hex'),
      }
    }
  }

  // 版本应用
  async apply(@Body() body: any) {
    const { templateId, type } = body
    console.log('exce;模板', templateId, type)
    const templateVersion = await TemplateVersionCollect.find({ templateId, type })
    if (templateVersion.length === 0) {
      throw new BadRequestException('模板版本不存在')
    }
    else {
      const file = templateVersion[0].file
      await TemplateCollect.updateOne({
        _id: templateId,
      }, {
        file,
      })
      const result = await TemplateVersionCollect.updateOne({ templateId, type }, { $set: { status: 2 } })
      return result
    }
  }
}
