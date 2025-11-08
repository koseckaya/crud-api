import request from 'supertest';
import { server } from '..';
import { mockUsers } from '../Users/mock';
import { ERROR_MSG } from '../constants';

const idUser = mockUsers[0].id;
const invalidUserId = 'UUID';
const idNotFound = '5c383a37-f3f3-4d13-acb9-9ff17898e744';
describe('GET /api/users/{userId}', () => {
  it('should return the user record if it exists', async () => {
    const response = await request(server).get(`/api/users/${idUser}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(idUser);
  });

  it('should return the error message if idUser is invalid', async () => {
    const response = await request(server).get(`/api/users/${invalidUserId}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(ERROR_MSG.INVALID_UUID);
  });

  it("should return the error message if userId doesn't found", async () => {
    const response = await request(server).get(`/api/users/${idNotFound}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(ERROR_MSG.USER_NOT_FOUND);
  });
});
