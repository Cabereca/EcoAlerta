import {
  type ICreateImageOccurrence,
  type IGetImageOccurrence
} from './ImageOccurrenceDTO';

export interface IGetOccurrence {
  id: string;
  title: string;
  description: string;
  status: String;
  feedback?: string;
  dateTime: Date;
  location: {
    lat: number;
    lng: number;
  };
  userId: string;
  employeeId?: string;
  ImageOccurrence: IGetImageOccurrence[];
}

export interface ICreateOccurrence {
  title: string;
  description: string;
  status: string;
  dateTime: Date;
  location: {
    lat: number;
    lng: number;
  };
  userId: string;
  employeeId?: string;
  ImageOccurrence: ICreateImageOccurrence[];
}

// export enum OccurrenceStatusa {
//   OPEN = 'OPEN',
//   IN_PROGRESS = 'IN_PROGRESS',
//   CLOSED = 'CLOSED'
// }
