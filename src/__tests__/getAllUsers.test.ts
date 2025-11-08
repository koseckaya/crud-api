import request from 'supertest';
import { server } from '..';
import { mockUsers } from '../Users/mock';

test('GET /api/users should return all users', async () => {
  const response = await request(server).get('/api/users');

  expect(response.status).toBe(200);

  expect(response.body).toEqual(mockUsers);
});
