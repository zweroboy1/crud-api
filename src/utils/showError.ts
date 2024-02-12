import { ServerResponse } from 'http';

export function showError(
  res: ServerResponse,
  code?: number,
  text?: string
): void {
  res.writeHead(code || 500, { 'Content-Type': 'text/plain' });
  res.write(text || 'Internal Server Error');
  res.end();
}
