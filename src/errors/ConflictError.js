import { AppError } from './AppError.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super({
      message,
      statusCode: 409,
      errorCode: ERROR_CODES.CONFLICT_ERROR,
    });
  }
}
