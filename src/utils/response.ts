import { ServerResponse } from 'node:http';
import { StatusCode } from '../types';

export const sendResponse = (
  res: ServerResponse,
  statusCode: StatusCode,
  data: unknown
) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(data));
  res.end();
};
