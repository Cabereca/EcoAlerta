import { Request, Response } from 'express';
import occurrenceService from '../services/occurrenceService';

const store = async (req: Request, res: Response) => {
  let data = req.body;
  const userId = req.user?.id;
  const reqFiles = req.files as Express.Multer.File[];
  const files = reqFiles.map((file) => {
    return {
      path: file.filename
    };
  });
  let lat, lng;
  const latlng = data.location.split(' ');
  lat = parseFloat(latlng[0]);
  lng = parseFloat(latlng[1]);
  data.location = {
    lat,
    lng
  };
  data.userId = userId as string;

  const occ = await occurrenceService.createOccurrence(data, files);

  return res.status(201).send(occ);
};

const show = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const occ = await occurrenceService.findOccurrencies(userId as string);
  return res.send(occ);
}

const index = async (req: Request, res: Response) => {
  const occs = await occurrenceService.findAllOccurencies();

  return res.send(occs);
};

const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const occ = await occurrenceService.updateOccurencies(id, data);

  return res.send(occ);
};

const updateStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.params;
  const employeeid = req.employee?.id;

  const occ = await occurrenceService.updateOccurrenceStatus(
    id,
    status,
    employeeid as string
  );

  return res.send(occ);
};

const destroy = async (req: Request, res: Response) => {
  const { id } = req.params;

  await occurrenceService.deleteOccurencies(id);

  return res.status(204).send();
};

export const occurrenceController = {
  store,
  index,
  show,
  update,
  updateStatus,
  destroy
};
