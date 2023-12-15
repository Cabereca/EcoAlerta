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

export const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new UnauthorizedError('Não autorizado');
  }
  const [, token] = authorization.split(' ');
  const { email } = jwt.verify(token, process.env.JWT_SECRET ?? '') as jwtDTO;

  let user;
  const cache = await redisClient.get('user:' + email);

  if (cache) {
    user = JSON.parse(cache);
  } else {
    user = await userServices.findUserByEmail(email);
    if (!user) {
      throw new NotFoundError('User not Found');
    }
    await redisClient.set('user:' + email, JSON.stringify(user));
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;
  req.user = userWithoutPassword;
  next();
};
