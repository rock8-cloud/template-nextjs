export const READ_ONLY_MESSAGE = 'This demo is read-only. Changes are turned off.'

export function isReadOnly(): boolean {
  return process.env.DEMO_READ_ONLY === 'true'
}
