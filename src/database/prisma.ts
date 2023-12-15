import { PrismaClient } from '@prisma/client';
import { ICreateOccurrence, IGetOccurrence } from '../dtos/OccurrenceDTO';
import { ICreateImageOccurrence } from '../dtos/ImageOccurrenceDTO';
import { v4 as uuidv4 } from 'uuid';
import { Sql } from '@prisma/client/runtime/library';

const prisma = new PrismaClient().$extends({
  model: {
    occurrence: {
      async create(data: {
        title: string;
        description: string;
        dateTime: Date;
        status: string;
        location: {
          lat: number;
          lng: number;
        };
        userId: string;
        employeeId?: string;
        ImageOccurrence: ICreateImageOccurrence[];
      }) {
        const occ: ICreateOccurrence = {
          title: data.title,
          description: data.description,
          dateTime: data.dateTime,
          status: data.status,
          location: {
            lat: data.location.lat,
            lng: data.location.lng
          },
          userId: data.userId,
          employeeId: data.employeeId,
          ImageOccurrence: data.ImageOccurrence
        };

        const occId = uuidv4();
        const point = `POINT(${occ.location.lat} ${occ.location.lng})`;
        await prisma.$queryRaw`INSERT INTO "Occurrence" ("id", "title", "description", "dateTime", "status", "location", "userId", "employeeId") VALUES (${occId}, ${occ.title}, ${occ.description}, ${occ.dateTime}, ${occ.status}, ST_GeomFromText(${point}, 4326), ${occ.userId}, ${occ.employeeId})`;

        occ.ImageOccurrence.forEach(async (image) => {
          await prisma.$queryRaw`INSERT INTO "ImageOccurrence" ("id", "path", "occurrenceId") VALUES (${uuidv4()}, ${
            image.path
          }, (SELECT "id" FROM "Occurrence" WHERE "userId" = ${
            occ.userId
          } LIMIT 1))`;
        });

        const createdOcc = prisma.occurrence.findUnique({
          where: {
            id: occId
          }
        });

        return createdOcc;
      },
      async findMany() {
        const occs: any =
          await prisma.$queryRaw`SELECT "id", "description", "userId", "employeeId", "created_at", "dateTime", "feedback", "title", "updated_at", "status", ST_AsText(location) as location FROM "Occurrence"`;

        const occsParsed = occs.map((occ: any) => {
          const location = occ.location
            .replace('POINT(', '')
            .replace(')', '')
            .split(' ');
          return {
            ...occ,
            location: {
              lat: parseFloat(location[0]),
              lng: parseFloat(location[1])
            }
          };
        });

        return occsParsed as IGetOccurrence[];
      }
    }
  }
});

export { prisma };
