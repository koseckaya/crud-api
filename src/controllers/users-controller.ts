import { IncomingMessage, ServerResponse } from 'http';
import { usersDB } from '../Users/users';
import { parseAndValidateBody } from '../utils/validation';
import { isValidUUID } from '../utils/validation';
import { ERROR_MSG, METHODS, STATUS_CODES } from '../constants';
import { sendResponse } from '../utils/response';

export class UsersController {
  private static readonly API_BASE = '/api/users';

  static async handleRequest(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
    const { method, url } = req;

    if (!url?.startsWith(this.API_BASE)) {
      return sendResponse(res, STATUS_CODES.NOT_FOUND, {
        message: `${ERROR_MSG.ENDPOINT_NOT_FOUND}: ${url}`
      });
    }

    switch (method) {
      case METHODS.GET:
        if (url === this.API_BASE) {
          return this.getAllUsers(res);
        }
        if (url.startsWith(`${this.API_BASE}/`)) {
          const userId = url.split(`${this.API_BASE}/`)[1];
          return this.getUserById(res, userId);
        }
        break;

      case METHODS.POST:
        if (url === this.API_BASE) {
          return this.createUser(req, res);
        }
        break;

      case METHODS.PUT:
        if (url.startsWith(`${this.API_BASE}/`)) {
          const userId = url.split(`${this.API_BASE}/`)[1];
          return this.updateUser(req, res, userId);
        }
        break;

      case METHODS.DELETE:
        if (url.startsWith(`${this.API_BASE}/`)) {
          const userId = url.split(`${this.API_BASE}/`)[1];
          return this.deleteUser(res, userId);
        }
        break;
    }

    sendResponse(res, STATUS_CODES.NOT_FOUND, {
      message: ERROR_MSG.ENDPOINT_NOT_FOUND
    });
  }

  private static getAllUsers(res: ServerResponse): void {
    const users = usersDB.getAllUsers();
    sendResponse(res, STATUS_CODES.OK, users);
  }

  private static getUserById(res: ServerResponse, userId: string): void {
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

  private static async createUser(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
    const result = await parseAndValidateBody(req);
    if (!result.isValid) {
      return sendResponse(res, STATUS_CODES.BAD_REQUEST, {
        message: result.error
      });
    }

    const newUser = usersDB.addUser(result.data);
    sendResponse(res, STATUS_CODES.CREATED, newUser);
  }

  private static async updateUser(
    req: IncomingMessage,
    res: ServerResponse,
    userId: string
  ): Promise<void> {
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

    const result = await parseAndValidateBody(req);

    if (!result.isValid) {
      return sendResponse(res, STATUS_CODES.BAD_REQUEST, {
        message: result.error
      });
    }

    const updatedUser = usersDB.updateUser(userId, {
      id: userId,
      ...result.data
    });

    sendResponse(res, STATUS_CODES.OK, updatedUser);
  }

  private static deleteUser(res: ServerResponse, userId: string): void {
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
