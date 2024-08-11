import { Request } from 'express';

export const getHeaders = (request: Request) => {
  return request.headers;
};
