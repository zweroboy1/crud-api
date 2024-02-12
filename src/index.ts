import http from 'http';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const PORT = process.env.PORT || 4000;

const server = http.createServer((request, response) => {
  const path = request.url || '';

  if (path === '/api/users') {
    response.write('API endpoint works!\n');
    response.write(Date.now().toString());
    response.end();
  } else {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write('404 Not Found');
    response.end();
  }
});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});