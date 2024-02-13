import { createHttpServer } from '../utils/createHttpServer';
import supertest from 'supertest';

const request = supertest(createHttpServer);

describe('HTTP Server Tests - Create and Delete User', () => {
  let createdUserId: string;

  it('should handle POST requests to /api/users', async () => {
    const newUser = {
      username: 'JohnDoe',
      age: 25,
      hobbies: ['reading', 'coding'],
    };

    const response = await request.post('/api/users').send(newUser);
    expect(response.status).toBe(201);

    const createdUser = JSON.parse(response.text);
    expect(createdUser.id).toBeDefined();

    createdUserId = createdUser.id;
  });

  it('should handle DELETE requests to /api/users/:userId', async () => {
    if (!createdUserId) {
      return;
    }

    const response = await request.delete(`/api/users/${createdUserId}`);
    expect(response.status).toBe(204);
  });
});
