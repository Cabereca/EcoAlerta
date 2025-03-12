import { prisma } from '../database/prisma';
import { type ICreateOccurrence } from '../dtos/OccurrenceDTO';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError
} from '../helpers/api-errors';

const createOccurrence = async (occurrence: ICreateOccurrence, files: any[]) => {
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
    ImageOccurrence: []
  });

  if (!occ) {
    throw new InternalServerError('Error on create occurrence');
  }

  files.forEach(async (file) => {
    await prisma.imageOccurrence.create({
      data: {
        path: file.path,
        occurrenceId: occ.id,
      }
    });
  });

  return occ;
};

const findAllOccurencies = async () => {
  const occs = await prisma.occurrence.findMany();

  if (!occs) {
    throw new NotFoundError('Occurrence not found');
  }

  const fullOccurrences = occs.map(async (occurrence) => {
    const images = await prisma.imageOccurrence.findMany({
      where: {
        occurrenceId: occurrence.id
      }
    });
    return {
      ...occurrence,
      images
    };
  });

  const fullOccurrence = await Promise.all(fullOccurrences);

  return fullOccurrence;
};

const findOccurrencies = async (userId: string) => {
  const oc = (await prisma.occurrence.findManyByUser(userId));

  if (!oc) {
    throw new NotFoundError('Occurrence not found');
  }
  const fullOccurrences = oc.map(async (occurrence) => {
    const images = await prisma.imageOccurrence.findMany({
      where: {
        occurrenceId: occurrence.id
      }
    });
    return {
      ...occurrence,
      images
    };
  });

  const fullOccurrence = await Promise.all(fullOccurrences);

  return fullOccurrence;
}

const findOccurrence = async (id: string) => {
  const oc = await prisma.occurrence.findUnique({
    where: {
      id
    }
  });
  if (!oc) {
    throw new NotFoundError('Occurrence not found');
  }
  const images = await prisma.imageOccurrence.findMany({
    where: {
      occurrenceId: oc.id
    }
  });
  return {
    ...oc,
    images
  };
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
      title: data.title ?? oc.title,
      description: data.description ?? oc.description,
      dateTime: data.dateTime ?? oc.dateTime,
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

const updateOccurrenceStatus = async (
  id: string,
  status: string,
  feedback: string,
  employeeId: string
) => {
  if (!id || !status) {
    throw new BadRequestError('Id and status are required');
  }
  let newStatus: string;
  switch (status.toLowerCase()) {
    case 'open':
      newStatus = 'open';
      break;
    case 'in_progress':
      newStatus = 'in_progress';
      break;
    case 'closed':
      newStatus = 'closed';
      break;
    default:
      throw new BadRequestError('Invalid status');
  }
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
      status: newStatus.toUpperCase(),
      employeeId,
      feedback
    }
  });
  if (!updatedOccurrence) {
    throw new InternalServerError('Error on update occurrence');
  }

  return updatedOccurrence;
};

const findOccurrenceImages = async (id: string) => {
  const images = await prisma.imageOccurrence.findMany({
    where: {
      occurrenceId: id
    }
  });
  return images;
}

export default {
  createOccurrence,
  findAllOccurencies,
  findOccurrencies,
  findOccurrence,
  updateOccurencies,
  updateOccurrenceStatus,
  deleteOccurencies,
  findOccurrenceImages
};
