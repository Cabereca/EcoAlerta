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

const findEmployee = async (id: string) => {
  if (!id) {
    throw new BadRequestError('Id is required');
  }
  const employee = await findEmployeeById(id);
  if (!employee) {
    throw new NotFoundError('Employee not found');
  }
  const { password, ...employeeWithoutPassword } = employee;
  return employeeWithoutPassword;
}

const createEmployee = async (data: ICreateEmployee) => {
  if (!data) {
    throw new BadRequestError('Data is required');
  }
  const employeeExists = await prisma.employee.findUnique({
    where: {
      email: data.email
    }
  });
  if (employeeExists) throw new BadRequestError('Employee already exists');
  const hashedPassword = await hashPassword(data.password);
  const employee = await prisma.employee.create({
    data: {
      registrationNumber: data.registrationNumber,
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword
    }
  });
  if (!employee) {
    throw new InternalServerError('Employee not created');
  }
  await redisClient.set('employee:' + employee.email, JSON.stringify(employee));
  const { password, ...userWithoutPassword } = employee;
  const token = generateToken({ email: employee.email });
  return { employee: { ...userWithoutPassword }, token };
};

const updateEmployee = async (id: string, data: IUpdateEmployee) => {
  if (!id) {
    throw new BadRequestError('Id is required');
  }
  if (!data) {
    throw new BadRequestError('Data is required');
  }
  const employee = await findEmployeeById(id);
  const employeeInCache = await findEmployeeInCache(employee.email);
  if (employeeInCache) {
    await redisClient.del('employee:' + employee.email);
  }
  const updatedEmployee = await prisma.employee.update({
    where: {
      id
    },
    data: {
      ...data,
      password: await hashPassword(String(data.password))
    }
  });
  if (!updatedEmployee) {
    throw new InternalServerError('Employee not updated');
  }
  await redisClient.set('employee:' + updatedEmployee.email, JSON.stringify(updatedEmployee));
  const { password, ...employeeWithoutPassword } = updatedEmployee;
  return employeeWithoutPassword;
};

const deleteEmployee = async (id: string) => {
  if (!id) {
    throw new BadRequestError('Id is required');
  }
  const employee = await prisma.employee.delete({
    where: {
      id
    }
  });
  await redisClient.del('employee:' + employee.email);
  if (!employee) {
    throw new InternalServerError('Employee not deleted');
  }
};

export default {
  findEmployeeById,
  findEmployeeByEmail,
  findEmployeeByRegistrationNumber,
  findEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  generateToken
};
