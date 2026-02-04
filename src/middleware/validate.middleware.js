import { ValidationError } from '../errors/ValidationError.js';

/**
 * Validate request body, query, or params using a Zod schema
 *
 * @param {import("zod").ZodSchema} schema - Zod schema to validate
 * @param {string} target - request target: "body" | "query" | "params" (default: "body")
 */
// Removed default value for target to allow detection of undefined
export const validateRequest = (schema, target) => {
  if (!schema) {
    throw new Error('Schema is required for validateRequest');
  }
  return (req, res, next) => {
    try {
      if (target) {
        const parsed = schema.parse(req[target]);
        req[target] = parsed;
        return next();
      }

      // Check if schema is "composite" (validates multiple parts of req)
      const isComposite =
        schema.shape &&
        ('body' in schema.shape || 'query' in schema.shape || 'params' in schema.shape);

      if (isComposite) {
        const parsed = schema.parse({
          body: req.body,
          query: req.query,
          params: req.params,
        });

        if (parsed.body) req.body = parsed.body;
        if (parsed.query) req.query = parsed.query;
        if (parsed.params) req.params = parsed.params;

        return next();
      }

      // Default behavior: validate body
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (err) {
      // Wrap Zod errors in a consistent ValidationError
      return next(new ValidationError(err.errors));
    }
  };
};
