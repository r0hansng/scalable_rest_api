import { AppError } from './AppError.js';
import { ERROR_CODES } from './errorCodes.js';

export class AuthorizationError extends AppError {
  constructor(message = 'Unauthorized access') {
    super({
      message,
      statusCode: 401,
      errorCode: ERROR_CODES.AUTHORIZATION_ERROR,
    });
  }
}
