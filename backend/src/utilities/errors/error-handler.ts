export class ErrorHandler extends Error {
  statusCode: number;
  message: string;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    console.error(`Error: ${message}`, { statusCode, stack: this.stack });
  }
}
