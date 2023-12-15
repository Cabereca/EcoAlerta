import { prisma } from '../database/prisma';
import { IGetOccurrence, type ICreateOccurrence } from '../dtos/OccurrenceDTO';
import { InternalServerError, NotFoundError } from '../helpers/api-errors';

const createOccurrence = async (occurrence: ICreateOccurrence, files: any) => {
  const { title, description, dateTime, status, location, userId, employeeId } =
    occurrence;
  const occ = await prisma.occurrence.create({
    title,
    description,
    dateTime: new Date(dateTime),
    status,
    location: {
      lat: location.lat,
      lng: location.lng
    },
    userId,
    employeeId,
    ImageOccurrence: files
  });

  return occ;
};

const findAllOccurencies = async () => {
  const occs = await prisma.occurrence.findMany();

  return occs as IGetOccurrence[];
};

const updateOccurencies = async (
  id: string,
  data: Partial<ICreateOccurrence>
) => {
  const oc = await prisma.occurrence.findUnique({
    where: {
      id
    }
  });
  if (!oc) {
    throw new NotFoundError('Occurrence not found');
  }
  const updatedOccurrence = await prisma.occurrence.update({
    where: {
      id
    },
    data: {
      title: data.title || oc.title,
      description: data.description || oc.description,
      dateTime: data.dateTime || oc.dateTime,
      status: data.status || oc.status,
      userId: data.userId || oc.userId,
      employeeId: data.employeeId || oc.employeeId
    }
  });
  if (!updatedOccurrence) {
    throw new InternalServerError('Error on update occurrence');
  }

  return updatedOccurrence;
};

const deleteOccurencies = async (id: string) => {
  const oc = await prisma.occurrence.findUnique({
    where: {
      id
    }
  });
  if (!oc) {
    throw new NotFoundError('Occurrence not found');
  }
  const deletedOccurrence = await prisma.occurrence.delete({
    where: {
      id
    }
  });
  if (!deletedOccurrence) {
    throw new InternalServerError('Error on delete occurrence');
  }
};

export default {
  createOccurrence,
  findAllOccurencies,
  updateOccurencies,
  deleteOccurencies
};
