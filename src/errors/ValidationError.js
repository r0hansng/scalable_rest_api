import { AppError } from './AppError.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

export class ValidationError extends AppError {
  constructor(message = 'Invalid request data') {
    let finalMessage = message;

    if (Array.isArray(message)) {
      // Format Zod errors into a readable string
      finalMessage = message.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
    }

    super({
      message: finalMessage,
      statusCode: 400,
      errorCode: ERROR_CODES.VALIDATION_ERROR,
    });
  }
}
