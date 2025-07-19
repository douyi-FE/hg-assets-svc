import { gzip, gunzip } from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

export function getJsonSizeMB(obj: any): number {
    // 将 JSON 对象转换为字符串
    const jsonString = JSON.stringify(obj);

    // 计算字节大小 (UTF-8 编码)
    const bytes = Buffer.byteLength(jsonString, 'utf8');

    // 转换为 MB
    return bytes / (1024 * 1024);
}

export async function compressData(data: any): Promise<Buffer> {
  try {
    // 使用 gzip 压缩
    const buffer = await gzipAsync(JSON.stringify(data));
    return buffer;
  } catch (error) {
    throw error;
  }
}

export async function decompressData(buffer: Buffer | any): Promise<any> {
  try {
    // 处理 MongoDB Binary 类型
    let bufferData: Buffer;
    if (buffer && typeof buffer === 'object' && buffer.buffer) {
      // MongoDB Binary 类型，转换为 Buffer
      bufferData = Buffer.from(buffer.buffer);
    } else if (buffer instanceof Buffer) {
      // 已经是 Buffer 类型
      bufferData = buffer;
    } else {
      throw new Error('Invalid buffer type for decompression');
    }
    
    const decompressed = await gunzipAsync(bufferData);
    return JSON.parse(decompressed.toString());
  } catch (error) {
    throw error;
  }
}
