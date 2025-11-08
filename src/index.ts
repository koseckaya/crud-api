import * as http from 'http';
import { isValidUUID } from './utils/validation';
import * as dotenv from 'dotenv';
import { usersDB } from './Users/users';
import { DEFAULT_PORT, ERROR_MSG, METHODS, STATUS_CODES } from './constants';

dotenv.config();

const PORT = process.env.PORT || DEFAULT_PORT;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const sendResponse = (statusCode: number, data: unknown): void => {
    res.statusCode = statusCode;
    res.end(JSON.stringify(data));
  };

  if (req.method === METHODS.GET && req.url === '/api/users') {
    const users = usersDB.getAllUsers();
    return sendResponse(STATUS_CODES.OK, users);
  }

  if (req.method === METHODS.GET && req.url?.startsWith('/api/users/')) {
    const userId = req.url.split('/api/users/')[1];

    if (!isValidUUID(userId)) {
      return sendResponse(STATUS_CODES.BAD_REQUEST, {
        message: ERROR_MSG.INVALID_UUID
      });
    }

    const user = usersDB.getUserById(userId);
    if (!user) {
      return sendResponse(STATUS_CODES.NOT_FOUND, {
        message: ERROR_MSG.USER_NOT_FOUND
      });
    }

    return sendResponse(STATUS_CODES.OK, user);
  }

  sendResponse(STATUS_CODES.NOT_FOUND, {
    message: ERROR_MSG.ENDPOINT_NOT_FOUND
  });
});

server.listen(PORT, () => {
  console.warn(`Server is running on port ${PORT}`);
});
