import { createHttpServer } from '../utils/createHttpServer';
import supertest from 'supertest';

const request = supertest(createHttpServer);

describe('HTTP Server Tests - Get User Details', () => {

  let firstUserId: string;

  it('should handle GET requests to /api/users', async () => {
    const response = await request.get('/api/users');
    expect(response.status).toBe(200);
    const users = JSON.parse(response.text);
    expect(users.length).toBeGreaterThan(0);
    firstUserId = users[0].id;
  });

  it('should handle GET requests to /api/users/:userId', async () => {
    if (!firstUserId) {
      return;
    }
    const response = await request.get(`/api/users/${firstUserId}`);
    expect(response.status).toBe(200);
  });

});
