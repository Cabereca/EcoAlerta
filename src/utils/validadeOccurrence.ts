import { z } from 'zod';

export const validateOccurrence = (data: any) => {
  const schema = z.object({
    title: z
      .string()
      .min(5)
      .max(50)
      .refine((t) => t.trim().length > 0, {
        message: 'Title cannot be empty'
      }),
    description: z
      .string()
      .min(10)
      .max(500)
      .refine((d) => d.trim().length > 0, {
        message: 'Description cannot be empty'
      }),
    location: z.object({
      lat: z.number(),
      lng: z.number()
    }),
    dateTime: z
      .string()
      .refine(
        (d) => new Date(d).getTime() > 0 && new Date(d).getTime() < Date.now(),
        {
          message: 'Date must be in the past'
        }
      ),
    userId: z.string().uuid(),
    employeeId: z.string().uuid().optional(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED'])
  });

  return schema.safeParse(data);
};
