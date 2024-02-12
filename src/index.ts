import cluster from 'cluster';
import http from 'http';
import { PORT, MULTIMODE, WORKERS_COUNT } from './constants';
import { balancer } from './utils/balancer';
import { createHttpServer } from './utils/createHttpServer';


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
  server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
