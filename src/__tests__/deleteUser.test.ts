import request from 'supertest';
import { mockUsers } from '../Users/mock';
import { server } from '..';
import { ERROR_MSG } from '../constants';

const idUser = mockUsers[0].id;
const idNotFound = '5c383a37-f3f3-4d13-acb9-9ff17898e744';
describe('DELETE /api/users/{userId}', () => {
  it('should delete the user', async () => {
    const response = await request(server).delete(`/api/users/${idUser}`);

    expect(response.status).toBe(204);
  });

  it('should return error if idUser is invalid', async () => {
    const response = await request(server).delete('/api/users/uuid');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: ERROR_MSG.INVALID_UUID
    });
  });

  it('should return status code 404 and corresponding message if user with userId does not exist', async () => {
    const response = await request(server).delete(`/api/users/${idNotFound}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: ERROR_MSG.USER_NOT_FOUND
    });
  });
});
