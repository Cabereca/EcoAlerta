/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import { userServices } from "../services/userService";
import { userValidateZod } from '../utils/validateUser';

const findAllUsers = async (req: Request, res: Response) => {
    const users = await userServices.showAllUsers();
    res.status(200).send(users);
}

const findUser = async (req: Request, res: Response) => {
    const id = req.user?.id;
    const user = await userServices.findUser(id as string);
    res.status(200).send(user);
}

const createUser = async (req: Request, res: Response) => {
    const user = req.body;
    const newUser = await userServices.createUser(user);
    res.status(201).send(newUser);
}

const updateUser = async (req: Request, res: Response) => {
    const id = req.user?.id;
    const user = req.body;
    const updatedUser = await userServices.updateUser(id as string, user);
    res.status(200).send(updatedUser);
}

const deleteUser = async (req: Request, res: Response) => {
    const id = req.user?.id;
    await userServices.deleteUser(id as string);
    res.sendStatus(204);
}

export const userController = { findAllUsers, findUser, createUser, updateUser, deleteUser };