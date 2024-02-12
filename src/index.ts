import cluster from 'cluster';
import http, { IncomingMessage, ServerResponse } from 'http';
import { PORT, MULTIMODE, WORKERS_COUNT } from './constants';
import { balancer } from './utils/balancer';

const createHttpServer = (
  request: IncomingMessage,
  response: ServerResponse
) => {
  const path = request.url || '';

  if (path === '/api/users') {
    response.write('API endpoint works!\n');
    response.write(`${MULTIMODE} ${WORKERS_COUNT}!\n`);
    response.write(Date.now().toString());
    response.end();
  } else {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write('404 Not Found');
    response.end();
  }
};

if (MULTIMODE) {
  if (cluster.isPrimary) {
    console.log(`Master process ${process.pid} is running on port ${PORT}`);
    const workerPorts: number[] = [];
    for (let i = 0; i < WORKERS_COUNT; i++) {
      const workerPort = PORT + 1 + i;
      cluster.fork({ CHILD_PORT: workerPort });
      workerPorts.push(workerPort);
    }
    cluster.on('exit', (worker, code, signal) => {
      console.log(
        `Worker ${worker.process.pid} died with code ${code} and signal ${signal}`
      );
      console.log('Forking a new worker');
      cluster.fork();
    });
    balancer(workerPorts, PORT);
  } else {
    const childPort = Number(process.env.CHILD_PORT);
    const server = http.createServer(createHttpServer);
    server.listen(childPort, () => {
      console.log(
        `Worker process ${process.pid} is running on port ${childPort}`
      );
    });
  }
} else {
  const server = http.createServer(createHttpServer);
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
