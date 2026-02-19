import axios from 'axios';
import type { MockEndpoint, CreateEndpointDto, RequestLog, Schema, SchemaTable, SchemaField, SchemaRelation, TablePosition } from '@/types';

const API_BASE_URL = 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const endpointsApi = {
  getAll: async (): Promise<MockEndpoint[]> => {
    const response = await api.get<MockEndpoint[]>('/endpoints');
    return response.data;
  },

  getById: async (id: string): Promise<MockEndpoint> => {
    const response = await api.get<MockEndpoint>(`/endpoints/${id}`);
    return response.data;
  },

  create: async (dto: CreateEndpointDto): Promise<MockEndpoint> => {
    const response = await api.post<MockEndpoint>('/endpoints', dto);
    return response.data;
  },

  update: async (id: string, dto: Partial<CreateEndpointDto>): Promise<MockEndpoint> => {
    const response = await api.put<MockEndpoint>(`/endpoints/${id}`, dto);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/endpoints/${id}`);
  },
};

export const logsApi = {
  getAll: async (): Promise<RequestLog[]> => {
    const response = await api.get<RequestLog[]>('/logs');
    return response.data;
  },

  clear: async (): Promise<void> => {
    await api.delete('/logs');
  },
};

export const testEndpoint = async (path: string, method: string, body?: object) => {
  const baseUrl = 'http://localhost:3001';
  const response = await api({
    method,
    url: `${baseUrl}${path}`,
    data: body,
  });
  return response.data;
};

export const schemasApi = {
  getAll: async (): Promise<Schema[]> => {
    const response = await api.get<Schema[]>('/schemas');
    return response.data;
  },

  getById: async (id: string): Promise<Schema> => {
    const response = await api.get<Schema>(`/schemas/${id}`);
    return response.data;
  },

  create: async (name: string): Promise<Schema> => {
    const response = await api.post<Schema>('/schemas', { name });
    return response.data;
  },

  update: async (id: string, data: Partial<Schema>): Promise<Schema> => {
    const response = await api.put<Schema>(`/schemas/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/schemas/${id}`);
  },

  addTable: async (schemaId: string, name: string, position?: TablePosition): Promise<SchemaTable> => {
    const response = await api.post<SchemaTable>(`/schemas/${schemaId}/tables`, { name, position });
    return response.data;
  },

  updateTable: async (schemaId: string, tableId: string, data: Partial<SchemaTable>): Promise<SchemaTable> => {
    const response = await api.put<SchemaTable>(`/schemas/${schemaId}/tables/${tableId}`, data);
    return response.data;
  },

  deleteTable: async (schemaId: string, tableId: string): Promise<void> => {
    await api.delete(`/schemas/${schemaId}/tables/${tableId}`);
  },

  updateTablePosition: async (schemaId: string, tableId: string, position: TablePosition): Promise<void> => {
    await api.put(`/schemas/${schemaId}/tables/${tableId}/position`, position);
  },

  addField: async (schemaId: string, tableId: string, field: Omit<SchemaField, 'id'>): Promise<SchemaField> => {
    const response = await api.post<SchemaField>(`/schemas/${schemaId}/tables/${tableId}/fields`, field);
    return response.data;
  },

  updateField: async (schemaId: string, tableId: string, fieldId: string, data: Partial<SchemaField>): Promise<SchemaField> => {
    const response = await api.put<SchemaField>(`/schemas/${schemaId}/tables/${tableId}/fields/${fieldId}`, data);
    return response.data;
  },

  deleteField: async (schemaId: string, tableId: string, fieldId: string): Promise<void> => {
    await api.delete(`/schemas/${schemaId}/tables/${tableId}/fields/${fieldId}`);
  },

  addRelation: async (schemaId: string, relation: Omit<SchemaRelation, 'id'>): Promise<SchemaRelation> => {
    const response = await api.post<SchemaRelation>(`/schemas/${schemaId}/relations`, relation);
    return response.data;
  },

  deleteRelation: async (schemaId: string, relationId: string): Promise<void> => {
    await api.delete(`/schemas/${schemaId}/relations/${relationId}`);
  },

  generateFromTable: async (schemaId: string, tableId: string, count?: number): Promise<object[]> => {
    const response = await api.post<object[]>(`/schemas/${schemaId}/generate`, { tableId, count });
    return response.data;
  },
};
