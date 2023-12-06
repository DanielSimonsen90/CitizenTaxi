const StatusCode = {
  OK: 200,
  NOT_FOUND: 404,
  0: 200,
  1: 404
};

/**
 * @typedef {Object} Data
 * @property {string} name
 * @property {number} age
 */

/**
 * @typedef {Object} SimulatedResponse
 * @property {StatusCode} statusCode
 * @property {Data} data
 */