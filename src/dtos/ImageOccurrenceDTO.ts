export interface IGetImageOccurrence {
  id: string;
  path: string;
  occurrenceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateImageOccurrence {
  path: string;
  occurrenceId: string;
}
