import { IncomingMessage, ServerResponse } from 'http';
import { getUsers } from '../usersStorage/userHandler';

export const createHttpServer = async (
  request: IncomingMessage,
  response: ServerResponse
) => {
  const path = request.url || '';

  if (path === '/api/users') {
    const users = await getUsers();
    response.write(JSON.stringify(users));
    response.end();
  } else {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write('404 Page is Not Found');
    response.end();
  }
};