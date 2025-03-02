import { Injectable } from '@nestjs/common'
import QuickNavCollect from '~/monogdb/models/quick-nav'

@Injectable()
export class QuickNavService {
  constructor() {}

  // 获取快捷导航
  async getQuickNav() {
    const quickNav = (await QuickNavCollect.find({})).map(item => item.quickNavIdList)
    return quickNav
  }

  // 新增快捷导航
  async addQuickNav(quickNav: any) {
    await QuickNavCollect.create(quickNav)
  }

  // 更新快捷导航
  async updateQuickNav(quickNav: any) {
    await QuickNavCollect.deleteMany({})
    await QuickNavCollect.create(quickNav)
  }
}
