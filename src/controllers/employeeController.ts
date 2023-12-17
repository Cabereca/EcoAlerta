/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import employeeService from '../services/employeeService';
import { employeeValidateZod } from '../utils/validateEmployee';

const show = async (req: Request, res: Response) => {
  const id = req.employee?.id;
  const employee = await employeeService.findEmployee(id as string);
  return res.json(employee);
};

const store = async (req: Request, res: Response) => {
  const employee = await employeeService.createEmployee(req.body);
  return res.status(201).json(employee);
};

const update = async (req: Request, res: Response) => {
  const id = req.employee?.id;
  const employee = await employeeService.updateEmployee(id as string, req.body);
  return res.json(employee);
};

const destroy = async (req: Request, res: Response) => {
  const id = req.employee?.id;
  await employeeService.deleteEmployee(id as string);
  return res.status(204).send();
};

export default {
  show,
  store,
  update,
  destroy
};
