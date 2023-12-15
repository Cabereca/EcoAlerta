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
    const { id } = req.params;
    const user = await userServices.findUser(id);
    res.status(200).send(user);
}

const createUser = async (req: Request, res: Response) => {
    const result = userValidateZod(req.body);
    if (!result.success) {
        const formattedError = result.error.format();
        return res.status(400).send(formattedError);
    }
    const user = req.body;
    const newUser = await userServices.createUser(user);
    res.status(201).send(newUser);
}

const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.body;
    const updatedUser = await userServices.updateUser(id, user);
    res.status(200).send(updatedUser);
}

const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    await userServices.deleteUser(id);
    res.sendStatus(204);
}

export const userController = { findAllUsers, findUser, createUser, updateUser, deleteUser };