import { type IGetOccurrence } from './OccurrenceDTO';

export interface IUser {
  id: string;
  cpf: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  occurrence: IGetOccurrence[];
}
