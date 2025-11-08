import * as http from 'http';
import { isValidUUID, validateUserData } from './utils/validation';
import * as dotenv from 'dotenv';
import { usersDB } from './Users/users';
import { DEFAULT_PORT, ERROR_MSG, METHODS, STATUS_CODES } from './constants';

import { sendResponse } from './utils/response';

dotenv.config();

const PORT = process.env.PORT || DEFAULT_PORT;
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === METHODS.GET && req.url === '/api/users') {
    const users = usersDB.getAllUsers();
    return sendResponse(res, STATUS_CODES.OK, users);
  }

  if (req.method === METHODS.GET && req.url?.startsWith('/api/users/')) {
    const userId = req.url.split('/api/users/')[1];

    if (!isValidUUID(userId)) {
      return sendResponse(res, STATUS_CODES.BAD_REQUEST, {
        message: ERROR_MSG.INVALID_UUID
      });
    }

    const user = usersDB.getUserById(userId);
    if (!user) {
      return sendResponse(res, STATUS_CODES.NOT_FOUND, {
        message: ERROR_MSG.USER_NOT_FOUND
      });
    }

    return sendResponse(res, STATUS_CODES.OK, user);
  }
  console.log('request ', req.method, req.url);
  if (req.method === METHODS.POST && req.url === '/api/users') {
    console.log('POST request received', req.url);
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const parsedData = JSON.parse(body);
        const validationResult = validateUserData(parsedData);

        if (!validationResult.isValid) {
          return sendResponse(res, STATUS_CODES.BAD_REQUEST, {
            message: validationResult.message
          });
        }

        const newUser = usersDB.addUser(validationResult.data);
        return sendResponse(res, STATUS_CODES.CREATED, newUser);
      } catch (error) {
        return sendResponse(res, STATUS_CODES.BAD_REQUEST, {
          message: ERROR_MSG.INVALID_JSON
        });
      }
    });

    return;
  }

  sendResponse(res, STATUS_CODES.NOT_FOUND, {
    message: ERROR_MSG.ENDPOINT_NOT_FOUND
  });
});
server.listen(PORT, () => {
  console.warn(`Server is running on port ${PORT}`);
});
