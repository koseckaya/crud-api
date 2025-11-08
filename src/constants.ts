export const DEFAULT_PORT = 4000;
export const ERROR_MSG = {
  INVALID_UUID: 'Invalid userId format',
  USER_NOT_FOUND: 'User not found',
  ENDPOINT_NOT_FOUND: 'Endpoint not found',
  MISSING_REQUIRED_FIELDS:
    'Missing required fields. Required fields: username (string), age (number), hobbies (array)',
  INVALID_DATA_TYPES:
    'Invalid data types. Required types: username (string), age (number), hobbies (array of strings)',
  INVALID_JSON: 'Invalid JSON in request body'
};

export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404
};
