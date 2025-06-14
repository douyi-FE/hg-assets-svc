import { exec } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'

import { MultipartFile } from '@fastify/multipart'

import dayjs from 'dayjs'

enum Type {
  IMAGE = '图片',
  TXT = '文档',
  MUSIC = '音乐',
  VIDEO = '视频',
  OTHER = '其他',
}

export function getFileType(extName: string) {
  const documents = 'txt doc pdf ppt pps xlsx xls docx'
  const music = 'mp3 wav wma mpa ram ra aac aif m4a'
  const video = 'avi mpg mpe mpeg asf wmv mov qt rm mp4 flv m4v webm ogv ogg'
  const image
    = 'bmp dib pcp dif wmf gif jpg tif eps psd cdr iff tga pcd mpt png jpeg'
  if (image.includes(extName))
    return Type.IMAGE

  if (documents.includes(extName))
    return Type.TXT

  if (music.includes(extName))
    return Type.MUSIC

  if (video.includes(extName))
    return Type.VIDEO

  return Type.OTHER
}

export function getName(fileName: string) {
  if (fileName.includes('.'))
    return fileName.split('.')[0]

  return fileName
}

export function getExtname(fileName: string) {
  return path.extname(fileName).replace('.', '')
}

export function getSize(bytes: number, decimals = 2) {
  if (bytes === 0)
    return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

export function fileRename(fileName: string) {
  const extName = path.extname(fileName)
  // 获取文件名（去掉扩展名后的部分）
  const name = fileName.slice(0, -extName.length)
  const time = dayjs().format('YYYYMMDDHHmmSSS')
  return `${name}-${time}${extName}`
}

export function getFilePath(name: string, currentDate: string, type: string) {
  return `/upload/${currentDate}/${type}/${name}`
}

export function getCadFilePath(name: string, currentDate: string) {
  return `/cad/${currentDate}/${name}`
}

export async function saveLocalFile(buffer: Buffer, name: string, currentDate: string, type: string) {
  const filePath = path.join(__dirname, '../../', 'public/upload/', `${currentDate}/`, `${type}/`)
  try {
    // 判断是否有该文件夹
    await fs.promises.stat(filePath)
  }
  catch (error) {
    // 没有该文件夹就创建
    await fs.promises.mkdir(filePath, { recursive: true })
  }
  const writeStream = fs.createWriteStream(filePath + name)
  writeStream.write(buffer)
}

export async function saveLocalDwgFile(fileName: string, name: string, currentDate: string, type: string) {
  const dwgFilePath = path.join(__dirname, '../../', 'public/upload/', `${currentDate}/`, `${type}/`, `${name}`)
  const commandBasePath = path.join(__dirname, '../../', 'mxcad/')
  const mxwebName = name.replace('.dwg', '.mxweb')
  const mxwebFilePath = path.join(__dirname, '../../', 'public/upload/', `${currentDate}/`, `${type}/`, `${mxwebName}`)

  // 获取文件名（去掉扩展名后的部分）
  const extName = getExtname(fileName)
  const fileNameWithoutExt = fileName.replace(`.${extName}`, '')

  // 确保目录存在
  const uploadDir = path.dirname(dwgFilePath)
  const cadDir = path.dirname(mxwebFilePath)

  try {
    await fs.promises.mkdir(uploadDir, { recursive: true })
    await fs.promises.mkdir(cadDir, { recursive: true })

    // 检查文件是否存在
    await fs.promises.access(dwgFilePath, fs.constants.F_OK)
  }
  catch (error) {
    // 没有该文件，报错，并结束
    throw new Error('没有找到文件，请检查文件是否存在')
  }
  // 判断当前运行环境是 windows 还是 linux
  // Windows 转换 dwg 为 mxweb
  /*
  示例代码：
  mxcadassembly.exe {"srcpath":"D:\test2.dwg","outpath":"D:\","outname":"test", "compression":0}
  其中 mxcadassembly.exe 为项目本地应用，相对路径为：/mxcad/Win_x86_64/mxcadassembly.exe
  srcpath 为 dwg 文件路径
  outpath 为 mxweb 文件路径，本项目中存储地址为：/public/cad/`${currentDate}/`
  outname 为 mxweb 文件名
  compression 为压缩级别，0 为不压缩，1 为压缩
  执行结果：
  成功：{"code":0,"message":"ok"}
  失败：{"code":1,"message":"read file error"}
  */
  let stdout: any = {}
  if (process.platform === 'win32') {
    // 如果是 windows，调用本地应用执行转换
    stdout = await execCommandInWindows(commandBasePath, dwgFilePath, mxwebFilePath, mxwebName)
  }
  else {
    // 如果是 linux，调用本地应用执行转换
    stdout = await execCommandInLinux(commandBasePath, dwgFilePath, mxwebFilePath, mxwebName)
  }
  try {
    let result: any = {}
    try {
      result = JSON.parse(stdout)
    }
    catch (error) {
      result = stdout
    }
    console.log('result', result)
    if (result.code !== 0 && !result.includes('"code":0')) {
      throw new Error(result.message || '转换失败')
    }
    const size = fs.statSync(mxwebFilePath).size
    return {
      path: mxwebFilePath,
      name: mxwebName,
      fileName: `${fileNameWithoutExt}.mxweb`,
      extName: 'mxweb',
      type: 'mxweb',
      size,
    }
  }
  catch (error) {
    // 如果命令执行失败，检查是否是因为非零退出码
    if (error.stdout) {
      try {
        const result = JSON.parse(error.stdout)
        if (result.code === 0) {
          const size = fs.statSync(mxwebFilePath).size
          return {
            path: mxwebFilePath,
            name: mxwebName,
            fileName: `${fileNameWithoutExt}.mxweb`,
            extName: 'mxweb',
            type: 'mxweb',
            size,
          }
        }
      }
      catch {
        // 如果解析失败，继续抛出原始错误
      }
    }
    throw error
  }
}

async function execCommandInWindows(commandBasePath: string, dwgFilePath: string, mxwebFilePath: string, mxwebName: string) {
  const commandPath = path.join(commandBasePath, 'Win_x86_64/mxcadassembly.exe')
  // 将路径中的反斜杠转换为正斜杠
  const command = `${commandPath} '{"srcpath":"${dwgFilePath.replace(/\\/g, '/')}","outpath":"${path.dirname(mxwebFilePath).replace(/\\/g, '/')}","outname":"${mxwebName}","compression":0}'`
  console.log('command', command)
  const execPromise = promisify(exec)
  try {
    // 添加选项：使用 shell 执行命令，并设置工作目录
    const { stdout } = await execPromise(command, {
      shell: 'powershell.exe',
      cwd: commandBasePath,
    })

    // 尝试解析返回的 JSON
    try {
      const result = JSON.parse(stdout)
      if (result.code === 0) {
        return stdout
      }
      else {
        throw new Error(`转换失败: ${result.message || '未知错误'}`)
      }
    }
    catch (parseError) {
      console.error('解析返回结果失败:', parseError)
      throw new Error('解析返回结果失败')
    }
  }
  catch (error) {
    // 如果 stdout 中有返回信息，尝试解析它
    if (error.stdout) {
      try {
        const result = JSON.parse(error.stdout)
        if (result.code === 0) {
          return error.stdout
        }
      }
      catch (e) {
        // 忽略解析错误
      }
    }
    // 如果 stderr 中有错误信息，使用它
    if (error.stderr) {
      throw new Error(error.stderr)
    }
    throw new Error(error.message)
  }
}

async function execCommandInLinux(commandBasePath: string, dwgFilePath: string, mxwebFilePath: string, mxwebName: string) {
  const commandPath = path.join(commandBasePath, 'Linux_x86_64/mxcadassembly')
  const jsonParams = {
    srcpath: dwgFilePath,
    outpath: path.dirname(mxwebFilePath),
    outname: mxwebName,
    compression: 0,
  }
  const command = `cd ${path.dirname(commandPath)} && ${commandPath} '${JSON.stringify(jsonParams)}'`
  const execPromise = promisify(exec)
  try {
    const { stdout } = await execPromise(command)
    return stdout
  }
  catch (error) {
    throw new Error(error.message)
  }
}

export async function saveFile(file: MultipartFile, name: string) {
  const filePath = path.join(__dirname, '../../', 'public/upload', name)
  const writeStream = fs.createWriteStream(filePath)
  const buffer = await file.toBuffer()
  writeStream.write(buffer)
}

export async function deleteFile(name: string) {
  fs.unlink(path.join(__dirname, '../../', 'public', name), () => {
    // console.log(error);
  })
}
