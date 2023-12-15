/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { z } from 'zod';
import { type ICreateEmployee } from '../dtos/EmployeeDTO';

const isValidPhone = (telefone: string) => {
    const phoneValidate = /^(\+\d{1,2}\s?)?(\()?\d{2,4}(\))?\s?(\d{4,5}(-|\s)?\d{4})$/;
    const isValid = phoneValidate.test(telefone);
    return isValid;
}

//  Função para validar o numero de registro
const isValidRegistrationNumber = (registrationNumber: string) => {
    const registrationNumberValidate = /^[0-9.-]+$/;
    const isValid = registrationNumberValidate.test(registrationNumber);
    return isValid;
}

export function employeeValidateZod(user: ICreateEmployee) {
    const userSchema = z.object({
        registrationNumber: z.string().min(3).max(18).refine(data => isValidRegistrationNumber(data), { message: 'Invalid registration number' }),
        name: z.string().min(3).max(255).refine(data => Boolean(data), { message: 'The name is mandatory' }),
        email: z.string().email({ message: 'Invalid email address' }).refine(data => Boolean(data), { message: 'The email is mandatory' }),
        phone: z.string().refine(data => isValidPhone(data), { message: 'Invalid telephone number' }),
        password: z.string().min(8).refine(data => Boolean(data), { message: 'The password is mandatory' }),
    });

    const result = userSchema.safeParse(user);
    return result;
}