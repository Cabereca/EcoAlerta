import { type NextFunction, type Request, type Response } from 'express';
import { validateOccurrence } from '../utils/validadeOccurrence';

export const validateOccurrenceMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const result = validateOccurrence(req.body);
    if (!result.success) {
        const formattedError = result.error.format();
        return res.status(400).send(formattedError);
    }
    next();
};