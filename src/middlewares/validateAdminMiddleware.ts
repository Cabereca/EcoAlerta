import { type NextFunction, type Request, type Response } from 'express';
import { employeeValidateZod } from '../utils/validateEmployee';

export const validateAdminMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const result = employeeValidateZod(req.body);
    if (!result.success) {
        const formattedError = result.error.format();
        return res.status(400).send(formattedError);
    }
    next();
};