import * as http from 'http';
import * as dotenv from 'dotenv';
import { DEFAULT_PORT } from './constants';
import { UsersController } from './controllers/users-controller';

dotenv.config();

const PORT = process.env.PORT || DEFAULT_PORT;
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  await UsersController.handleRequest(req, res);
});
server.listen(PORT, () => {
  console.warn(`Server is running on port ${PORT}`);
});
