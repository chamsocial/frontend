export const ONE_KB = 1024
export const TEN_MB = 10485760

/**
 * Converts a long string of bytes into a readable format e.g KB, MB, GB, TB, YB
 *
 * @param {Int} num The number of bytes.
 */
export function readableBytes(bytes) {
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  return `${(bytes / (1024 ** i)).toFixed(2) * 1} ${sizes[i]}`
}
