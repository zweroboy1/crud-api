import http from 'http';
const PORT = 4000;

const server = http.createServer((_request, response) => {
  response.write('Server works!\n');
  response.write(Date.now().toString());
  response.end();
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});