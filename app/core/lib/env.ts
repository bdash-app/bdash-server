function env(key: string): string
function env<T>(key: string, defaultValue: T): string | T
function env<T>(key: string, defaultValue?: T): string | T {
  const val = process.env[key]
  if (val === undefined) {
    if (arguments.length === 1) {
      throw new Error(`ENV: ${key} is required.`)
    } else {
      return defaultValue as T
    }
  }
  return val
}

export { env }
