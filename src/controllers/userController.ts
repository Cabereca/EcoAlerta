/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import { userServices } from "../services/userService";

const findAllUsers = async (req: Request, res: Response) => {
    const users = await userServices.showAllUsers();
    res.status(200).send(users);
}

const findUser = async (req: Request, res: Response) => {
    const { email } = req.params;
    const user = await userServices.findUser(email);
    res.status(200).send(user);
}

const createUser = async (req: Request, res: Response) => {
    const user = req.body;
    const newUser = await userServices.createUser(user);
    res.status(201).send(newUser);
}

const updateUser = async (req: Request, res: Response) => {
    const { email } = req.params;
    const user = req.body;
    const updatedUser = await userServices.updateUser(email, user);
    res.status(200).send(updatedUser);
}

const deleteUser = async (req: Request, res: Response) => {
    const { email } = req.params;
    await userServices.deleteUser(email);
    res.sendStatus(204);
}

export const userController = { findAllUsers, findUser, createUser, updateUser, deleteUser };