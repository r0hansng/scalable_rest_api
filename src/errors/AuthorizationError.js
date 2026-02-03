import { AppError } from './AppError.js';

export class AuthorizationError extends AppError {
  constructor(message = 'Unauthorized access') {
    super({
      message,
      statusCode: 401,
      errorCode: 'AUTHORIZATION_ERROR',
    });
  }
}
