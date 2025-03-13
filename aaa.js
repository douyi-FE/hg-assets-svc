const fs = require('node:fs')

fs.promises.unlink('D:/codes/hg-assets-svc/public/upload/2025-03-10/bussiness/文档/产值表-无营业收入-202503102251089.xlsx').then((res) => {
  console.log('删除成功', res)
}).catch((err) => {
  console.log('删除失败', err)
})
