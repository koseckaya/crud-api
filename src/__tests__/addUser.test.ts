import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { server } from '..';
import { ERROR_MSG } from '../constants';

jest.mock('uuid', () => ({
  v4: jest.fn()
}));

describe('GET /api/users', () => {
  test('POST /api/users should create a new user', async () => {
    const newUser = {
      username: 'Alex Brown',
      age: 28,
      hobbies: ['gaming', 'reading']
    };

    jest.mocked(uuidv4).mockReturnValue('UUID');
    const response = await request(server).post('/api/users').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 'UUID', ...newUser });
  });

  test('POST /api/users should return status code 400 if body does not contain required fields', async () => {
    const newUser = {
      username: 'Alex Brown',
      hobbies: ['gaming', 'reading']
    };

    const response = await request(server).post('/api/users').send(newUser);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: ERROR_MSG.MISSING_REQUIRED_FIELDS
    });
  });
});
