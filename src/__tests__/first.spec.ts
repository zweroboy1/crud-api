import { createHttpServer } from '../utils/createHttpServer';
import supertest from 'supertest';

const request = supertest(createHttpServer);

describe('HTTP Server Tests', () => {
  it('should respond with 404 for unknown routes', async () => {
    const response = await request.get('/unknown-route');
    expect(response.status).toBe(404);
  });

  it('should respond with 400 for bad post requests', async () => {
    const response = await request.post('/api/users/invalid_user');
    expect(response.status).toBe(400);
  });

  it('should respond with 400 for bad put requests', async () => {
    const response = await request.put('/api/users/invalid_user');
    expect(response.status).toBe(400);
  });

  it('should handle GET requests to /api/users', async () => {
    const response = await request.get('/api/users');
    expect(response.status).toBe(200);
  });
});
