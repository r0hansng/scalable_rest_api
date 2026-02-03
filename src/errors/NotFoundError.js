import { AppError } from './AppError.js';
import { ERROR_CODES } from './errorCodes.js';

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super({
      message: `${resource} not found`,
      statusCode: 404,
      errorCode: ERROR_CODES.NOT_FOUND,
    });
  }
}
