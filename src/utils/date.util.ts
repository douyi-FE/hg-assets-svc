import dayjs from 'dayjs'
import { isDate } from 'lodash'
import { generateUUID } from './tool.util'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD'

export function formatToDateTime(
  date: string | number | Date | dayjs.Dayjs | null | undefined = undefined,
  format = DATE_TIME_FORMAT,
): string {
  return dayjs(date).format(format)
}

export function formatToDate(
  date: string | number | Date | dayjs.Dayjs | null | undefined = undefined,
  format = DATE_FORMAT,
): string {
  return dayjs(date).format(format)
}

export function isDateObject(obj: unknown): boolean {
  return isDate(obj) || dayjs.isDayjs(obj)
}

export function addDataRowHideFields(data: any, userId: string = null) {
  if (!data) {
    return data
  }
  Object.keys(data).forEach((key) => {
    // sheet 层, 判断 data[key] 是否为对象
    if (typeof data[key] === 'object' && data[key] !== null) {
      // 对象层
      const tableName = Object.keys(data[key]).find(item => item.startsWith('table'))
      if (tableName) {
        const tableData = data[key][tableName]
        if (tableData && tableData.length > 0) {
          tableData.forEach((item: any) => {
            if (!item._id || item._id === '') {
              item._id = generateUUID()
            }
            item._sheet = key
            if (userId) {
              item._userId = userId
            }
          })
        }
      }
    }
  })
  return data
}
