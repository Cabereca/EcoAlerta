import { z } from 'zod';

const isValidLatLng = (data: string) => {
  const latlng = data.split(' ');
  const latitude = parseFloat(latlng[0]);
  const longitude = parseFloat(latlng[1]);

  // Expressão regular para verificar o formato
  const pattern = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)\s*[,]\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;

  // Verifica o formato usando a expressão regular
  if (!pattern.test(`${latitude},${longitude}`)) {
    return false;
  }

  // Verifica os intervalos válidos
  if (-90 <= latitude && latitude <= 90 && -180 <= longitude && longitude <= 180) {
    return true;
  } else {
    return false;
  }
};

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
    location: z.string(). refine((data) => isValidLatLng(data), { message: 'Invalid Latitude or Longitude' }),
    dateTime: z
      .string()
      .refine(
        (d) => new Date(d).getTime() > 0 && new Date(d).getTime() < Date.now(),
        {
          message: 'Date must be in the past'
        }
      ),
    // userId: z.string().uuid().optional(),
    employeeId: z.string().uuid().optional(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED'])
  });

  return schema.safeParse(data);
};
