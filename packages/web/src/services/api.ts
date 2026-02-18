import axios from 'axios';
import type { MockEndpoint, CreateEndpointDto, RequestLog } from '@/types';

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
