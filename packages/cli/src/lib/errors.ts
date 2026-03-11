export class CliError extends Error {
  readonly hint?: string;

  constructor(message: string, hint?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "CliError";
    this.hint = hint;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
