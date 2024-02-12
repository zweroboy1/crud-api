import { ServerResponse } from 'http';

export const sendResponse = (response: ServerResponse, statusCode: number, body: string) => {
  response.writeHead(statusCode, { 'Content-Type': 'text/plain' });
  response.write(body);
  response.end();
};