export class WhiskError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = "WhiskError"
  }

  static from(error: unknown): WhiskError {
    if (error instanceof WhiskError) {
      return error
    }
    if (error instanceof Error) {
      return new WhiskError(error.message, { cause: error })
    }
    return new WhiskError(String(error))
  }
}
