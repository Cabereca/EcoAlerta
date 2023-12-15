/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import { NotFoundError, UnauthorizedError } from '../helpers/api-errors';
import bcrypt from 'bcrypt';
import client from '../database/redis';
import { userServices } from '../services/userService';
import employeeService from '../services/employeeService';

const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user;

  const cache = await client.get('user:' + email);
  if (cache) {
    user = JSON.parse(cache);
  } else {
    user = await userServices.findUserByEmail(email);
    if (!user) {
      throw new NotFoundError('User not Found');
    }
    await client.set('user:' + email, JSON.stringify(user));
  }
  const verifyPassword = await bcrypt.compare(password, user.password);
  if (!verifyPassword) {
    throw new UnauthorizedError('Usuário ou senha incorretos');
  }
  const token = userServices.generateToken({ email: user.email });
  const { password: _, ...userWithoutPassword } = user;

  return res.send({
    user: {
      ...userWithoutPassword
    },
    token
  });
};

const employeeLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let employee;

  const cache = await client.get('employee:' + email);
  if (cache) {
    employee = JSON.parse(cache);
  } else {
    employee = await employeeService.findEmployeeByEmail(email);
    if (!employee) {
      throw new NotFoundError('Employee not Found');
    }
    await client.set('employee:' + email, JSON.stringify(employee));
  }
  const verifyPassword = await bcrypt.compare(password, employee.password);
  console.log(verifyPassword, employee.password, password);

  if (!verifyPassword) {
    throw new UnauthorizedError('Usuário ou senha incorretos');
  }
  const token = employeeService.generateToken({ email: employee.email });
  const { password: _, ...userWithoutPassword } = employee;

  return res.send({
    user: {
      ...userWithoutPassword
    },
    token
  });
};

export { userLogin, employeeLogin };
