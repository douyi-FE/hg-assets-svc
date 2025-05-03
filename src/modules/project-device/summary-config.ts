import { cloneDeep } from 'lodash'

export const summaryConfig = {
  'static-equipment': {
    classColumns: ['物料编码', '设备名称', '设备材质'],
    summaryColumns: ['设备数量'],
  },
  'dynamic-equipment': {
    classColumns: ['物料编码', '设备名称', '规格型号'],
    summaryColumns: ['设备数量'],
  },
  'industrial-pipe': {
    classColumns: ['物料编码', '材料名称', '规格'],
    summaryColumns: ['蓝图量'],
  },
  'steel-structure': {
    classColumns: ['物料编码', '名称', '规格型号', '材质'],
    summaryColumns: ['数量（m/m2）', '总重kg0-6m', '总重kg6-30m'],
  },
  'electrical-instrument': {
    classColumns: ['物料编码', '名称', '规格'],
    summaryColumns: ['单量'],
  },
  'civil-water-heating': {
    classColumns: ['物料编码', '项目名称', '规格'],
    summaryColumns: ['单量', '工程量'],
  },
  'ventilation-duct': {
    classColumns: ['物料编码', '项目名称', '规格', '单位'],
    summaryColumns: ['长边/直径(mm)', '短边(mm)', '高(mm)', '截面周长(m)', '截面积(m2)', '封堵个数', '封堵面积(m2)', '构件表面积(m2)'],
  },
}

export function getSummaryData(tableData: any[], classColumns: string[], summaryColumns: string[]) {
  const summaryGroup = {}
  tableData.forEach((item) => {
    const groupKey = classColumns.map(column => item[column]).join('-')
    if (!summaryGroup[groupKey]) {
      summaryGroup[groupKey] = [cloneDeep(item)]
    }
    else {
      summaryGroup[groupKey].push(cloneDeep(item))
    }
  })
  const summaryData = []
  Object.keys(summaryGroup).forEach((key) => {
    const group = summaryGroup[key]
    // 把group中所有summaryColumns的值相加，回填到summaryColumns中
    /*
            例如：
            group = [
                {
                    '物料编码': '1',
                    '设备名称': '设备1',
                    '规格型号': '1',
                    '设备数量': 1,
                },
                {
                    '物料编码': '1',
                    '设备名称': '设备1',
                    '规格型号': '1',
                    '设备数量': 1,
                },
            ]
            汇总并回填后：
            summaryItem = [
                {
                    '物料编码': '1',
                    '设备名称': '设备1',
                    '规格型号': '1',
                    '设备数量': 2,
                },
            ]
        */
    const summaryItem = group.reduce((acc, curr) => {
      Object.keys(acc).forEach((column) => {
        if (summaryColumns.includes(column)) {
          if (acc !== curr) {
            acc[column] += curr[column]
          }
        }
      })
      return acc
    }, group[0])
    summaryData.push(summaryItem)
  })
  return summaryData
}

export const engineerData = [
  {
    type: '静设备',
    code: 'static-equipment',
    view: 'static-equip',
  },
  {
    type: '动设备',
    code: 'dynamic-equipment',
    view: 'moving-equip',
  },
  {
    type: '工业管道',
    code: 'industrial-pipe',
    view: 'industrial-piping',
  },
  {
    type: '钢结构',
    code: 'steel-structure',
    view: 'steel-structure',
  },
  {
    type: '电气仪表',
    code: 'electrical-instrument',
    view: 'electrical-instru',
  },
  {
    type: '民用水暖',
    code: 'civil-water-heating',
    view: 'water-heater',
  },
  {
    type: '通风管道',
    code: 'ventilation-pipe',
    view: 'ventilation-duct',
  },
]
