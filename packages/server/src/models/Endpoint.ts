import { MockEndpoint, CreateEndpointDto, UpdateEndpointDto } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../utils/storage';

const DEFAULT_ENDPOINTS: MockEndpoint[] = [
  {
    id: uuidv4(),
    path: '/api/users',
    method: 'GET',
    response: {
      users: [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ]
    },
    delay: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    path: '/api/users',
    method: 'POST',
    response: {
      success: true,
      message: 'User created successfully'
    },
    delay: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    path: '/api/products',
    method: 'GET',
    response: {
      products: [
        { id: 1, name: 'Laptop', price: 999.99 },
        { id: 2, name: 'Mouse', price: 29.99 },
        { id: 3, name: 'Keyboard', price: 79.99 }
      ]
    },
    delay: 0,
    createdAt: new Date().toISOString(),
  },
];

export class EndpointModel {
  private endpoints: Map<string, MockEndpoint> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = storage.getEndpoints();
    
    if (stored.length === 0) {
      DEFAULT_ENDPOINTS.forEach(ep => {
        this.endpoints.set(ep.id, ep);
      });
      storage.setEndpoints(Array.from(this.endpoints.values()));
    } else {
      stored.forEach(ep => {
        this.endpoints.set(ep.id, ep);
      });
    }
  }

  create(dto: CreateEndpointDto): MockEndpoint {
    const id = uuidv4();
    const endpoint: MockEndpoint = {
      id,
      path: dto.path.startsWith('/') ? dto.path : `/${dto.path}`,
      method: dto.method,
      response: dto.response,
      delay: dto.delay || 0,
      createdAt: new Date().toISOString(),
    };
    this.endpoints.set(id, endpoint);
    storage.addEndpoint(endpoint);
    return endpoint;
  }

  findAll(): MockEndpoint[] {
    return Array.from(this.endpoints.values());
  }

  findById(id: string): MockEndpoint | undefined {
    return this.endpoints.get(id);
  }

  findByPath(path: string, method: string): MockEndpoint | undefined {
    return Array.from(this.endpoints.values()).find(
      (ep) => ep.path === path && ep.method === method
    );
  }

  update(id: string, dto: UpdateEndpointDto): MockEndpoint | null {
    const endpoint = this.endpoints.get(id);
    if (!endpoint) return null;

    const updated: MockEndpoint = {
      ...endpoint,
      path: dto.path ? (dto.path.startsWith('/') ? dto.path : `/${dto.path}`) : endpoint.path,
      method: dto.method || endpoint.method,
      response: dto.response || endpoint.response,
      delay: dto.delay !== undefined ? dto.delay : endpoint.delay,
    };
    this.endpoints.set(id, updated);
    storage.updateEndpoint(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    const deleted = this.endpoints.delete(id);
    if (deleted) {
      storage.deleteEndpoint(id);
    }
    return deleted;
  }

  clear(): void {
    this.endpoints.clear();
    storage.clear();
    DEFAULT_ENDPOINTS.forEach(ep => {
      const newEp = { ...ep, id: uuidv4() };
      this.endpoints.set(newEp.id, newEp);
    });
    storage.setEndpoints(Array.from(this.endpoints.values()));
  }
}

export const endpointModel = new EndpointModel();
