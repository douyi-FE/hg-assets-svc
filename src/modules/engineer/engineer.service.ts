// 工程服务
import { Injectable } from '@nestjs/common'
import EngineerCollect from '~/monogdb/models/engineer'

@Injectable()
export class EngineerService {
  constructor() {}

  // 新增工程
  async createEngineer(engineer: any): Promise<any> {
    return EngineerCollect.create(engineer).then((res) => {
      return '工程新增成功'
    })
  }

  // 更新工程
  async updateEngineer(id: string, engineer: any): Promise<any> {
    return EngineerCollect.findByIdAndUpdate(id, engineer, { new: true }).then((res) => {
      return '工程更新成功'
    })
  }

  // 依据装置获取工程列表
  async getEngineerListByDevice(deviceCode: string): Promise<any[]> {
    return EngineerCollect.find({ device_code: deviceCode }).then(res => res.map((item: any) => ({ ...item._doc, _id: item._id.buffer.toString('hex') })))
  }

  // 删除工程
  async deleteEngineer(id: string): Promise<any> {
    return EngineerCollect.findByIdAndDelete(id).then((res) => {
      return '工程删除成功'
    })
  }
}
