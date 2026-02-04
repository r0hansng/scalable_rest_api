/**
 * Parses pagination query params and returns limit and offset
 * @param {object} query - Request query object
 * @param {number} defaultLimit - Default number of items per page
 * @param {number} maxLimit - Maximum allowed items per page
 * @returns {object} { limit, offset, page }
 */
export function getPagination(query, defaultLimit = 20, maxLimit = 100) {
  let page = parseInt(query.page, 10) || 1;
  let limit = parseInt(query.limit, 10) || defaultLimit;

  if (limit > maxLimit) limit = maxLimit;
  if (page < 1) page = 1;

  const offset = (page - 1) * limit;

  return { limit, offset, page };
}

/**
 * Formats paginated results
 * @param {Array} data - Array of fetched items
 * @param {number} total - Total number of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {object} Paginated response
 */
export function formatPaginatedResponse(data, total, page, limit) {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      totalItems: total,
      totalPages,
      currentPage: page,
      perPage: limit,
    },
  };
}
