import { AppError } from './AppError.js';

export class ValidationError extends AppError {
  constructor(message = 'Invalid request data') {
    super({
      message,
      statusCode: 400,
      errorCode: 'VALIDATION_ERROR',
    });
  }
}
