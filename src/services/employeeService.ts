/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { PrismaClient } from '@prisma/client';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError
} from '../helpers/api-errors';
import {
  type ICreateEmployee,
  type IUpdateEmployee
} from '../dtos/EmployeeDTO';
import redisClient from '../database/redis';
import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const hashPassword = async (password: string) => {
  return await hash(password, 10);
};
interface TokenType {
  email: string;
}

const generateToken = ({ email }: TokenType) => {
  const token = jwt.sign({ email }, process.env.JWT_ADMIN_SECRET ?? '', {
    expiresIn: '8h'
  });
  return token;
};

const findEmployeeInCache = async (email: string) => {
  const employee = await redisClient.get('employee:' + email);
  if (employee) {
    return JSON.parse(employee);
  }
  return null;
};
const findEmployeeById = async (id: string) => {
  if (!id) {
    throw new BadRequestError('Id is required');
  }
  const employeeInCache = await findEmployeeInCache(id);
  if (employeeInCache) {
    return employeeInCache;
  }
  const employee = await prisma.employee.findUnique({
    where: {
      id
    }
  });
  if (!employee) {
    throw new NotFoundError('Employee not found');
  }
  return employee;
};

const findEmployeeByEmail = async (email: string) => {
  if (!email) {
    throw new BadRequestError('Email is required');
  }
  const employee = await prisma.employee.findUnique({
    where: {
      email
    }
  });
  if (!employee) {
    throw new NotFoundError('Employee not found');
  }
  return employee;
};

const findEmployeeByRegistrationNumber = async (registrationNumber: string) => {
  if (!registrationNumber) {
    throw new BadRequestError('Registration number is required');
  }
  const employee = await prisma.employee.findUnique({
    where: {
      registrationNumber
    }
  });
  if (!employee) {
    throw new NotFoundError('Employee not found');
  }
  return employee;
};

const createEmployee = async (data: ICreateEmployee) => {
  if (!data) {
    throw new BadRequestError('Data is required');
  }
  const employee = await prisma.employee.create({
    data: {
      ...data,
      password: await hashPassword(data.password)
    }
  });
  if (!employee) {
    throw new InternalServerError('Employee not created');
  }
  await redisClient.set('employee:' + employee.email, JSON.stringify(employee));
  return employee;
};

const updateEmployee = async (email: string, data: IUpdateEmployee) => {
  if (!email) {
    throw new BadRequestError('Email is required');
  }
  if (!data) {
    throw new BadRequestError('Data is required');
  }
  const employeeInCache = await findEmployeeInCache(email);
  if (employeeInCache) {
    await redisClient.del('employee:' + email);
  }
  const employee = await prisma.employee.update({
    where: {
      email
    },
    data: {
      ...data,
      password: await hashPassword(String(data.password))
    }
  });
  if (!employee) {
    throw new InternalServerError('Employee not updated');
  }
  await redisClient.set('employee:' + employee.email, JSON.stringify(employee));
  return employee;
};

const deleteEmployee = async (email: string) => {
  if (!email) {
    throw new BadRequestError('Email is required');
  }
  const employee = await prisma.employee.delete({
    where: {
      email
    }
  });
  await redisClient.del('employee:' + email);
  if (!employee) {
    throw new InternalServerError('Employee not deleted');
  }
};

export default {
  findEmployeeById,
  findEmployeeByEmail,
  findEmployeeByRegistrationNumber,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  generateToken
};
