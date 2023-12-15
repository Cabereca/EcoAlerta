/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type IUserInputDTO } from '../dtos/UserDTO';
import { BadRequestError, InternalServerError } from '../helpers/api-errors';
import jwt from 'jsonwebtoken';
import { hash } from 'bcrypt';
import { prisma } from '../database/prisma';
import redisClient from '../database/redis';

interface TokenType {
  email: string;
}

const hashPassword = async (password: string) => {
  return await hash(password, 10);
};

const generateToken = ({ email }: TokenType) => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET ?? '', {
    expiresIn: '8h'
  });
  return token;
};

const findUserByEmail = async (email: string) => {
  if (!email) throw new BadRequestError('Email is required');
  const user = await prisma.user.findUnique({ where: { email } });
  return user;
};

const showAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      cpf: true,
      name: true,
      email: true,
      phone: true
    }
  });
  return users;
};

const findUser = async (email: string) => {
  const user = await findUserByEmail(email);
  if (!user) throw new BadRequestError('User not found');
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const createUser = async (user: IUserInputDTO) => {
  const userExists = await findUserByEmail(user.email);
  if (userExists) throw new BadRequestError('User already exists');
  const hashedPassword = await hashPassword(user.password);
  const newUser = await prisma.user.create({
    data: {
      cpf: user.cpf,
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: hashedPassword
    }
  });
  if (!newUser) throw new InternalServerError('Error creating user');
  const { password, ...userWithoutPassword } = newUser;
  const token = generateToken({ email: user.email });
  return { user: { ...userWithoutPassword }, token };
};

const updateUser = async (email: string, userData: IUserInputDTO) => {
  const user = await findUserByEmail(email);
  if (!user) throw new BadRequestError('User not found');
  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      cpf: userData.cpf ?? user.cpf,
      name: userData.name ?? user.name,
      email: userData.email ?? user.email,
      phone: userData.phone ?? user.phone
    }
  });
  await redisClient.del('user:' + email);
  await redisClient.set(
    'user:' + userData.email ?? 'user:' + email,
    JSON.stringify(updatedUser)
  );
  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

const deleteUser = async (email: string) => {
  const user = await findUserByEmail(email);
  if (!user) throw new BadRequestError('User not found');
  await redisClient.del('user:' + email);
  await prisma.user.delete({ where: { email } });
};

export const userServices = {
  findUser,
  findUserByEmail,
  showAllUsers,
  createUser,
  updateUser,
  deleteUser,
  generateToken
};
