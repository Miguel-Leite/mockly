import { Router, Request, Response } from 'express';
import { endpointModel } from '../models/Endpoint';
import { schemaModel } from '../models/Schema';
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

// Schema routes
router.get('/schemas', (_req: Request, res: Response) => {
  const schemas = schemaModel.findAll();
  res.json(schemas);
});

router.post('/schemas', (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const schema = schemaModel.create(name);
    res.status(201).json(schema);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/schemas/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const schema = schemaModel.findById(id);
  if (!schema) {
    return res.status(404).json({ error: 'Schema not found' });
  }
  res.json(schema);
});

router.put('/schemas/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, tables, relations } = req.body;
  const schema = schemaModel.update(id, { name, tables, relations });
  if (!schema) {
    return res.status(404).json({ error: 'Schema not found' });
  }
  res.json(schema);
});

router.delete('/schemas/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = schemaModel.delete(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Schema not found' });
  }
  res.status(204).send();
});

router.post('/schemas/:id/tables', (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, position } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Table name is required' });
  }
  const table = schemaModel.addTable(id, name, position);
  if (!table) {
    return res.status(404).json({ error: 'Schema not found' });
  }
  res.status(201).json(table);
});

router.put('/schemas/:id/tables/:tableId', (req: Request, res: Response) => {
  const { id, tableId } = req.params;
  const { name, fields } = req.body;
  const table = schemaModel.updateTable(id, tableId, { name, fields });
  if (!table) {
    return res.status(404).json({ error: 'Schema or table not found' });
  }
  res.json(table);
});

router.delete('/schemas/:id/tables/:tableId', (req: Request, res: Response) => {
  const { id, tableId } = req.params;
  const deleted = schemaModel.deleteTable(id, tableId);
  if (!deleted) {
    return res.status(404).json({ error: 'Schema or table not found' });
  }
  res.status(204).send();
});

router.put('/schemas/:id/tables/:tableId/position', (req: Request, res: Response) => {
  const { id, tableId } = req.params;
  const { x, y } = req.body;
  const updated = schemaModel.updateTablePosition(id, tableId, { x, y });
  if (!updated) {
    return res.status(404).json({ error: 'Schema or table not found' });
  }
  res.json({ success: true });
});

router.post('/schemas/:id/tables/:tableId/fields', (req: Request, res: Response) => {
  const { id, tableId } = req.params;
  const field = req.body;
  if (!field.name || !field.type) {
    return res.status(400).json({ error: 'Field name and type are required' });
  }
  const newField = schemaModel.addField(id, tableId, field);
  if (!newField) {
    return res.status(404).json({ error: 'Schema or table not found' });
  }
  res.status(201).json(newField);
});

router.put('/schemas/:id/tables/:tableId/fields/:fieldId', (req: Request, res: Response) => {
  const { id, tableId, fieldId } = req.params;
  const updates = req.body;
  const field = schemaModel.updateField(id, tableId, fieldId, updates);
  if (!field) {
    return res.status(404).json({ error: 'Schema, table, or field not found' });
  }
  res.json(field);
});

router.delete('/schemas/:id/tables/:tableId/fields/:fieldId', (req: Request, res: Response) => {
  const { id, tableId, fieldId } = req.params;
  const deleted = schemaModel.deleteField(id, tableId, fieldId);
  if (!deleted) {
    return res.status(404).json({ error: 'Schema, table, or field not found' });
  }
  res.status(204).send();
});

router.post('/schemas/:id/relations', (req: Request, res: Response) => {
  const { id } = req.params;
  const { fromTable, toTable, type, fromField, toField } = req.body;
  if (!fromTable || !toTable || !type) {
    return res.status(400).json({ error: 'fromTable, toTable, and type are required' });
  }
  const relation = schemaModel.addRelation(id, { fromTable, toTable, type, fromField, toField });
  if (!relation) {
    return res.status(404).json({ error: 'Schema not found' });
  }
  res.status(201).json(relation);
});

router.delete('/schemas/:id/relations/:relationId', (req: Request, res: Response) => {
  const { id, relationId } = req.params;
  const deleted = schemaModel.deleteRelation(id, relationId);
  if (!deleted) {
    return res.status(404).json({ error: 'Schema or relation not found' });
  }
  res.status(204).send();
});

router.post('/schemas/:id/generate', (req: Request, res: Response) => {
  const { id } = req.params;
  const { tableId, count } = req.body;

  if (!tableId) {
    return res.status(400).json({ error: 'tableId is required' });
  }

  const data = schemaModel.generateFromTable(id, tableId, count || 1);
  res.json(data);
});

export default router;
