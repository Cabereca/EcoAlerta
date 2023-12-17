import { type NextFunction, type Request, type Response } from 'express';
import { userValidateZod } from '../utils/validateUser';

export const validateUserMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const result = userValidateZod(req.body);
    if (!result.success) {
        const formattedError = result.error.format();
        return res.status(400).send(formattedError);
    }
    next();
};