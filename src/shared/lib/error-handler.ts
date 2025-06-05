export class ErrorHandler {
  static handle(error: unknown, context: string): string {
    console.error(`Error in ${context}:`, error);

    if (error instanceof Error) {
      return this.getErrorMessage(error);
    }

    if (typeof error === 'string') {
      return error;
    }

    return 'An unexpected error occurred';
  }

  private static getErrorMessage(error: Error): string {
    if (error.name === 'SyntaxError') {
      return 'Invalid syntax in the input';
    }

    if (error.name === 'TypeError') {
      return 'Invalid type or format';
    }

    if (error.message.includes('Invalid HTML')) {
      return 'The provided HTML is invalid or malformed';
    }

    if (error.message.includes('parsererror')) {
      return 'Failed to parse the input. Please check the syntax';
    }

    return error.message || 'An error occurred during processing';
  }

  static async handleAsync<T>(
    promise: Promise<T>,
    context: string
  ): Promise<[T, null] | [null, string]> {
    try {
      const result = await promise;
      return [result, null];
    } catch (error) {
      const errorMessage = this.handle(error, context);
      return [null, errorMessage];
    }
  }

  static logError(error: unknown, context: string, additionalInfo?: any): void {
    console.error(`[${new Date().toISOString()}] Error in ${context}:`, {
      error,
      additionalInfo,
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}
