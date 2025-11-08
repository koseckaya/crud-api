import * as http from 'http';
import * as dotenv from 'dotenv';
import { DEFAULT_PORT, ERROR_MSG, METHODS, STATUS_CODES } from './constants';

import { sendResponse } from './utils/response';
import { UsersController } from './controllers/users.controller';

dotenv.config();

const PORT = process.env.PORT || DEFAULT_PORT;
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === METHODS.GET && req.url === '/api/users') {
    return UsersController.getAllUsers(res);
  }

  if (req.method === METHODS.GET && req.url?.startsWith('/api/users/')) {
    const userId = req.url.split('/api/users/')[1];
    return UsersController.getUserById(res, userId);
  }

  if (req.method === METHODS.POST && req.url === '/api/users') {
    return UsersController.createUser(req, res);
  }

  if (req.method === METHODS.PUT && req.url?.startsWith('/api/users/')) {
    const userId = req.url.split('/api/users/')[1];
    return UsersController.updateUser(req, res, userId);
  }

  if (req.method === METHODS.DELETE && req.url?.startsWith('/api/users/')) {
    const userId = req.url.split('/api/users/')[1];
    return UsersController.deleteUser(res, userId);
  }

  sendResponse(res, STATUS_CODES.NOT_FOUND, {
    message: ERROR_MSG.ENDPOINT_NOT_FOUND
  });
});
server.listen(PORT, () => {
  console.warn(`Server is running on port ${PORT}`);
});
