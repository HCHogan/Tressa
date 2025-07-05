import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 计算字符串的UTF-8字节大小
 * @param str 要计算的字符串
 * @returns 字节大小
 */
export function getUtf8ByteSize(str: string): number {
  return new Blob([str]).size;
}

/**
 * 格式化字节大小为可读格式
 * @param bytes 字节数
 * @returns 格式化后的字符串
 */
export function formatByteSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 获取内容大小限制
 * @param isLoggedIn 是否已登录
 * @returns 字节大小限制
 */
export function getContentSizeLimit(isLoggedIn: boolean): number {
  return isLoggedIn ? 1048576 : 262144; // 1MB : 256KB
}

/**
 * 获取内容大小限制的可读格式
 * @param isLoggedIn 是否已登录
 * @returns 格式化后的大小限制字符串
 */
export function getContentSizeLimitText(isLoggedIn: boolean): string {
  return isLoggedIn ? '1MB' : '256KB';
}
