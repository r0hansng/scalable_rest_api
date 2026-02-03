import { ValidationError } from '../errors/ValidationError.js';

/**
 * Validate request body, query, or params using a Zod schema
 * 
 * @param {import("zod").ZodSchema} schema - Zod schema to validate
 * @param {string} target - request target: "body" | "query" | "params" (default: "body")
 */
export const validateRequest = (schema, target = 'body') => {
  return (req, res, next) => {
    try {
      schema.parse(req[target]);
      next();
    } catch (err) {
      // Wrap Zod errors in a consistent ValidationError
      return next(new ValidationError(err.errors));
    }
  };
};