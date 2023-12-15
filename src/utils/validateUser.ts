/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { z } from 'zod';
import { type IUserInputDTO } from '../dtos/UserDTO';

const isValidPhone = (telefone: string) => {
    const phoneValidate = /^(\+\d{1,2}\s?)?(\()?\d{2,4}(\))?\s?(\d{4,5}(-|\s)?\d{4})$/;
    const isValid = phoneValidate.test(telefone);
    return isValid;
}

function isValidCPF(cpf: string) {
    // Remover caracteres não numéricos
    const cleanedCPF = cpf.replace(/\D/g, '');
    // Verificar se o CPF tem 11 dígitos
    if (cleanedCPF.length !== 11) {
        return false;
    }
    // Verificar se todos os dígitos são iguais, o que tornaria o CPF inválido
    if (/^(\d)\1{10}$/.test(cleanedCPF)) {
        return false;
    }
    return true;
}

export function userValidateZod(user: IUserInputDTO) {
    const userSchema = z.object({
        cpf: z.string().refine(data => isValidCPF(data), { message: 'Invalid CPF' }),
        name: z.string().min(3).max(255).refine(data => Boolean(data), { message: 'The name is mandatory' }),
        email: z.string().email({ message: 'Invalid email address' }).refine(data => Boolean(data), { message: 'The email is mandatory' }),
        phone: z.string().refine(data => isValidPhone(data), { message: 'Invalid telephone number' }),
        password: z.string().min(8).refine(data => Boolean(data), { message: 'The password is mandatory' }),
    });

    const result = userSchema.safeParse(user);
    return result;
}