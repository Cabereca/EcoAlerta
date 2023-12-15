/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type NextFunction, type Request, type Response } from 'express';
import { NotFoundError, UnauthorizedError } from '../helpers/api-errors';
import jwt from 'jsonwebtoken';
import { userServices } from '../services/userService';
import redisClient from '../database/redis';

interface jwtDTO {
  email: string;
}

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new UnauthorizedError('Não autorizado');
  }
  const [, token] = authorization.split(' ');
  const { email } = jwt.verify(
    token,
    process.env.JWT_ADMIN_SECRET ?? ''
  ) as jwtDTO;

  let employee;
  const cache = await redisClient.get(`employee:${email}`);

  if (cache) {
    employee = JSON.parse(cache);
  } else {
    employee = await userServices.findUserByEmail(email);
    if (!employee) {
      throw new NotFoundError('Employee not Found');
    }
    await redisClient.set('employee' + email, JSON.stringify(employee));
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  req.employee = employee;
  next();
};
