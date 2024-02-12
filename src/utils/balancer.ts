import http, { IncomingMessage, ServerResponse } from 'http';
import { showError } from './showError';

export function balancer(
  workerPorts: number[],
  mainPort: number
): http.Server<typeof IncomingMessage, typeof ServerResponse> {
  let currentWorkerId = 0;
  const balancerServer = http.createServer((req, res) => {
    const workerPort = workerPorts[currentWorkerId++ % workerPorts.length];
    proxyRequest(workerPort, req, res);
  });
  balancerServer.listen(mainPort, () => {
    console.log(`Load Balancer is running on port ${mainPort}`);
  });
  return balancerServer;
}

function proxyRequest(
  workerPort: number,
  req: IncomingMessage,
  res: ServerResponse
) {
  const hostHeader = req.headers.host;
  if (!hostHeader) {
    console.error(`Host header is not available in the request.`);
    showError(res);
    return;
  }

  const hostname = hostHeader.split(':')[0];

  const options = {
    hostname: hostname,
    port: workerPort,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  console.log(`Worker on port ${workerPort} is handling the request!`);

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxyReq, { end: true });

  proxyReq.on('error', (err) => {
    console.error(`Error proxying request: ${err.message}`);
    showError(res);
  });
}
