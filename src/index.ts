import * as http from 'http';
import * as dotenv from 'dotenv';
import { DEFAULT_PORT, ERROR_MSG, STATUS_CODES } from './constants';
import { UsersController } from './controllers/users-controller';
import { sendResponse } from './utils/response';

dotenv.config();

const PORT = process.env.PORT || DEFAULT_PORT;

export const server = http.createServer(async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    await UsersController.handleRequest(req, res);
  } catch (error) {
    sendResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, {
      message: `${ERROR_MSG.INTERNAL_SERVER_ERROR}: ${error}`
    });
  }
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
