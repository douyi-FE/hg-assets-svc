// 装置服务
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import DeviceCollect from '~/monogdb/models/device'
import EngineerCollect from '~/monogdb/models/engineer'

@Injectable()
export class DeviceService {
  constructor() {}

  // 新增装置
  async createDevice(device: any): Promise<any> {
    return DeviceCollect.create(device).then((res) => {
      return 'device created successfully'
    })
  }

  // 更新装置
  async updateDevice(id: string, device: any): Promise<any> {
    return DeviceCollect.findByIdAndUpdate(id, device, { new: true }).then((res) => {
      return 'device updated successfully'
    })
  }

  // 依据项目获取装置列表
  async getDeviceListByProject(projectId: string): Promise<any[]> {
    return DeviceCollect.find({ project_id: projectId })
      .then(res => res.map((item: any) => ({
        ...item._doc,
        _id: item._id.buffer.toString('hex'),
      })))
  }

  // 删除装置
  async deleteDevice(id: string, code: string): Promise<any> {
    const deviceList = await EngineerCollect.find({ device_code: code })
    if (deviceList.length > 0) {
      throw new HttpException('装置下存在工程，不能删除', HttpStatus.BAD_REQUEST)
    }
    return DeviceCollect.findByIdAndDelete(id).then((res) => {
      return 'device deleted successfully'
    })
  }
}
