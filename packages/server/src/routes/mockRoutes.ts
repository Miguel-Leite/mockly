import { Router, Request, Response } from 'express';
import { endpointModel } from '../models/Endpoint';
import { logger } from '../utils/logger';
import { CreateEndpointDto, UpdateEndpointDto } from '../types';

const router = Router();

router.post('/endpoints', (req: Request, res: Response) => {
  try {
    const { path, method, response, delay } = req.body;

    if (!path || !method || !response) {
      return res.status(400).json({
        error: 'Path, method and response are required',
      });
    }

    const existing = endpointModel.findByPath(path, method);
    if (existing) {
      return res.status(409).json({
        error: 'Endpoint already exists',
      });
    }

    const dto: CreateEndpointDto = { path, method, response, delay };
    const endpoint = endpointModel.create(dto);
    res.status(201).json(endpoint);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/endpoints', (_req: Request, res: Response) => {
  const endpoints = endpointModel.findAll();
  res.json(endpoints);
});

router.get('/endpoints/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const endpoint = endpointModel.findById(id);

  if (!endpoint) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }

  res.json(endpoint);
});

router.put('/endpoints/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { path, method, response, delay } = req.body;

  const dto: UpdateEndpointDto = {};
  if (path) dto.path = path;
  if (method) dto.method = method;
  if (response) dto.response = response;
  if (delay !== undefined) dto.delay = delay;

  const endpoint = endpointModel.update(id, dto);

  if (!endpoint) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }

  res.json(endpoint);
});

router.delete('/endpoints/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = endpointModel.delete(id);

  if (!deleted) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }

  res.status(204).send();
});

router.delete('/endpoints', (_req: Request, res: Response) => {
  endpointModel.clear();
  res.json({ message: 'All endpoints cleared and reset to defaults' });
});

router.get('/logs', (_req: Request, res: Response) => {
  const logs = logger.getLogs();
  res.json(logs);
});

router.delete('/logs', (_req: Request, res: Response) => {
  logger.clear();
  res.status(204).send();
});

export default router;
