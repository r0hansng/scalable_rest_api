import { AppError } from './AppError.js';

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super({
      message: `${resource} not found`,
      statusCode: 404,
      errorCode: 'NOT_FOUND',
    });
  }
}
