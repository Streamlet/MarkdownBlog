
// https://nodejs.org/api/process.html#process_process_platform
module.exports.platform = process.platform
module.exports.PLATFORMS = {
  AIX: 'aix',
  DARWIN: 'darwin',
  FREEBSD: 'freebsd',
  LINUX: 'linux',
  OPENBSD: 'openbsd',
  SUNOS: 'sunos',
  WIN32: 'win32',
}
