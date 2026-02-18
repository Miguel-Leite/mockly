export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface MockEndpoint {
  id: string;
  path: string;
  method: HttpMethod;
  response: object;
  delay?: number;
  createdAt: string;
}

export interface CreateEndpointDto {
  path: string;
  method: HttpMethod;
  response: object;
  delay?: number;
}

export interface UpdateEndpointDto {
  path?: string;
  method?: HttpMethod;
  response?: object;
  delay?: number;
}

export interface MockServerConfig {
  port?: number;
  cors?: boolean;
}

export interface RequestLog {
  id: string;
  endpointId: string;
  path: string;
  method: string;
  status: number;
  timestamp: string;
  responseTime?: number;
}
