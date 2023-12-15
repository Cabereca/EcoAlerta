import { IGetEmployee } from '../dtos/EmployeeDTO';
import { type IUser } from '../dtos/UserDTO';

declare global {
    namespace Express {
        export interface Request {
            user?: Partial<IUser>;
            employee?: Partial<IGetEmployee>;
        }
    }
}