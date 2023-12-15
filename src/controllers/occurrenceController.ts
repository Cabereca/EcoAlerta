import { Request, Response } from 'express';
import occurrenceService from '../services/occurrenceService';

const store = async (req: Request, res: Response) => {
  let data = req.body;
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

  const occ = await occurrenceService.createOccurrence(data, files);
  console.log(occ);

  return res.status(201).send(occ);
};

const index = async (req: Request, res: Response) => {
  const occs = await occurrenceService.findAllOccurencies();

  console.log(occs);

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
  const { status } = req.body;

  const occ = await occurrenceService.updateOccurencies(id, status);

  return res.send(occ);
};

const destroy = async (req: Request, res: Response) => {
  const { id } = req.params;

  const occ = await occurrenceService.deleteOccurencies(id);

  return res.status(204).send();
};

export const occurrenceController = {
  store,
  index,
  update,
  updateStatus,
  destroy
};
