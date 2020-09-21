
// https://nodejs.org/api/process.html#process_process_platform
export const platform:string = process.platform
export const PLATFORMS = {
  AIX: 'aix',
  DARWIN: 'darwin',
  FREEBSD: 'freebsd',
  LINUX: 'linux',
  OPENBSD: 'openbsd',
  SUNOS: 'sunos',
  WIN32: 'win32',
}
