import { AppError } from './AppError.js';
import { ERROR_CODES } from './errorCodes.js';

export class ValidationError extends AppError {
  constructor(message = 'Invalid request data') {
    super({
      message,
      statusCode: 400,
      errorCode: ERROR_CODES.VALIDATION_ERROR,
    });
  }
}
