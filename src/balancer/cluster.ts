import * as cluster from 'node:cluster';
import * as os from 'node:os';
import http from 'node:http';
import { DEFAULT_PORT } from '../constants';
import { createServer } from './server';
import { UpdateMessage } from '../types';
import { usersDB } from '../Users/users';

const numCPUs = os.cpus().length;
const PORT = process.env.PORT || DEFAULT_PORT;

if (process.env.MULTI) {
  if (cluster.default.isPrimary) {
    for (let i = 1; i < numCPUs; i++) {
      cluster.default.fork({ PORT: Number(PORT) + i });
    }
    cluster.default.on('message', (worker, message) => {
      if (message.type === 'update') {
        Object.values(cluster.default.workers!).forEach((w) => {
          if (w !== worker) {
            w?.send(message);
          }
        });
      }
    });

    let currentWorker = 0;
    const workers = Object.values(cluster.default.workers || {});

    http
      .createServer((req, res) => {
        const worker = workers[currentWorker];
        currentWorker = (currentWorker + 1) % workers.length;
        const id = worker?.id || 0;

        const options = {
          hostname: 'localhost',
          port: Number(PORT) + id,
          path: req.url,
          method: req.method,
          headers: req.headers
        };

        const proxyReq = http.request(options, (proxyRes) => {
          res.writeHead(proxyRes.statusCode!, proxyRes.headers);
          proxyRes.pipe(res);
        });

        req.pipe(proxyReq);
      })
      .listen(PORT, () => {
        console.log(`Load balancer running at http://localhost:${PORT}/`);
      });
  } else {
    process.on('message', (message: UpdateMessage) => {
      if (message.type === 'update') {
        usersDB.synchronizationDB(message.data);
      }
    });

    createServer(Number(process.env.WORKER_ID));
  }
}
