import { IncomingMessage, ServerResponse } from 'http';
import { usersDB } from '../Users/users';
import { validateUserData } from '../utils/validation';
import { isValidUUID } from '../utils/validation';
import { ERROR_MSG, STATUS_CODES } from '../constants';
import { sendResponse } from '../utils/response';

export class UsersController {
  static getAllUsers(res: ServerResponse): void {
    const users = usersDB.getAllUsers();
    sendResponse(res, STATUS_CODES.OK, users);
  }

  static getUserById(res: ServerResponse, userId: string): void {
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

    sendResponse(res, STATUS_CODES.OK, user);
  }

  static createUser(req: IncomingMessage, res: ServerResponse): void {
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
        sendResponse(res, STATUS_CODES.CREATED, newUser);
      } catch (error) {
        sendResponse(res, STATUS_CODES.BAD_REQUEST, {
          message: ERROR_MSG.INVALID_JSON
        });
      }
    });
  }

  static updateUser(
    req: IncomingMessage,
    res: ServerResponse,
    userId: string
  ): void {
    if (!isValidUUID(userId)) {
      return sendResponse(res, STATUS_CODES.BAD_REQUEST, {
        message: ERROR_MSG.INVALID_UUID
      });
    }

    const existingUser = usersDB.getUserById(userId);
    if (!existingUser) {
      return sendResponse(res, STATUS_CODES.NOT_FOUND, {
        message: ERROR_MSG.USER_NOT_FOUND
      });
    }

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

        const updatedUser = usersDB.updateUser(userId, {
          id: userId,
          ...validationResult.data
        });

        sendResponse(res, STATUS_CODES.OK, updatedUser);
      } catch (error) {
        sendResponse(res, STATUS_CODES.BAD_REQUEST, {
          message: ERROR_MSG.INVALID_JSON
        });
      }
    });
  }

  static deleteUser(res: ServerResponse, userId: string): void {
    if (!isValidUUID(userId)) {
      return sendResponse(res, STATUS_CODES.BAD_REQUEST, {
        message: ERROR_MSG.INVALID_UUID
      });
    }

    const existingUser = usersDB.getUserById(userId);
    if (!existingUser) {
      return sendResponse(res, STATUS_CODES.NOT_FOUND, {
        message: ERROR_MSG.USER_NOT_FOUND
      });
    }

    usersDB.deleteUser(userId);
    sendResponse(res, STATUS_CODES.NO_CONTENT, null);
  }
}
