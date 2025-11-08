import 'dotenv/config';
import http from 'node:http';
import { UsersController } from '../controllers/users-controller';
import { usersDB } from '../Users/users';

export const LOAD_BALANCER_PORT = process.env.PORT || 4000;

export const createServer = (workerId?: number): void => {
  const port = Number(LOAD_BALANCER_PORT) + (workerId || 0);
  const server = http.createServer(async (request, response) => {
    console.log(
      `Worker ${port} handling request ${request.method} ${request.url}`
    );
    await UsersController.handleRequest(request, response);

    process.send?.({ type: 'update', data: usersDB.getAllUsers() });
  });

  server.listen(port, () => {
    console.log(
      ` ${workerId ? 'Worker' : 'Server'} running at http://localhost:${port}/`
    );
  });
};
