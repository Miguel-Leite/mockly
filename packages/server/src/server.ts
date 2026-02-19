import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { endpointModel } from './models/Endpoint';
import { processObject, processFakerTemplate } from './utils/faker';
import { logger } from './utils/logger';
import mockRoutes from './routes/mockRoutes';
import { MockServerConfig, HttpMethod, RequestLog, ResponseType } from './types';

export class MockServer {
  private app: Application;
  private server: any;
  private port: number;

  constructor(config: MockServerConfig = {}) {
    this.app = express();
    this.port = config.port || 3001;

    this.app.use(cors());
    this.app.use(express.json());

    this.setupLogging();
    this.setupMockRoutes();
    this.setupStaticFiles();
    this.setupMockHandler();
  }

  private setupStaticFiles(): void {
    const webDistPath = path.join(__dirname, '../../web/dist');
    this.app.use(express.static(webDistPath));
    this.app.get('/', (_req, res) => {
      res.sendFile(path.join(webDistPath, 'index.html'));
    });
  }

  private setupLogging(): void {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      // Skip logging for API management routes
      if (req.path.startsWith('/api/endpoints') || req.path.startsWith('/api/logs')) {
        return next();
      }

      const start = Date.now();
      
      res.on('finish', () => {
        const endpoint = endpointModel.findByPath(req.path, req.method as HttpMethod);
        
        logger.addLog({
          endpointId: endpoint?.id || '',
          path: req.path,
          method: req.method,
          status: res.statusCode,
          timestamp: new Date().toISOString(),
          responseTime: Date.now() - start,
        });

        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${Date.now() - start}ms)`);
      });

      next();
    });
  }

  private setupMockRoutes(): void {
    this.app.use('/api', mockRoutes);
  }

  private setupMockHandler(): void {
    this.app.all('*', async (req: Request, res: Response) => {
      const method = req.method as HttpMethod;
      const endpoint = endpointModel.findByPath(req.path, method);

      if (!endpoint) {
        if (method === 'POST' || method === 'PUT') {
          const createdEndpoint = await this.handleAutoCreateOrStore(req, res);
          if (createdEndpoint) return;
        }
        return res.status(404).json({ error: 'Endpoint not found' });
      }

      if (endpoint.delay && endpoint.delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, endpoint.delay));
      }

      let responseData: any;

      if (method === 'POST' || method === 'PUT') {
        responseData = await this.handlePostPut(req, res, endpoint);
        if (!responseData) return;
      } else {
        responseData = this.processResponse(endpoint);
      }

      res.json(responseData);
    });
  }

  private async handleAutoCreateOrStore(req: Request, res: Response): Promise<boolean> {
    const path = req.path;
    const body = req.body;

    const existingGet = endpointModel.findByPath(path, 'GET');
    
    if (existingGet) {
      if (!existingGet.storedData) {
        existingGet.storedData = [];
      }
      
      if (Array.isArray(existingGet.response)) {
        existingGet.storedData.push(body);
        endpointModel.update(existingGet.id, { storedData: existingGet.storedData });
      } else {
        const stored = existingGet.storedData.length > 0 ? existingGet.storedData : [existingGet.response];
        stored.push(body);
        endpointModel.update(existingGet.id, { 
          storedData: stored,
          response: stored 
        });
      }
      
      res.status(201).json({ success: true, message: 'Data stored', data: body });
      return true;
    }

    const newEndpoint = endpointModel.create({
      path,
      method: 'GET',
      response: [body],
      storedData: [body],
    });

    res.status(201).json({ 
      success: true, 
      message: 'Endpoint created and data stored',
      data: body,
      createdEndpoint: {
        path: newEndpoint.path,
        method: newEndpoint.method
      }
    });
    return true;
  }

  private async handlePostPut(req: Request, res: Response, endpoint: any): Promise<any> {
    const body = req.body;
    
    if (endpoint.payloadJson || endpoint.payloadSchemaRef) {
      const isValid = this.validatePayload(body, endpoint);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid payload' });
      }
    }

    if (!endpoint.storedData) {
      endpoint.storedData = [];
    }

    endpoint.storedData.push(body);
    endpointModel.update(endpoint.id, { storedData: endpoint.storedData });

    return { success: true, message: 'Data stored', data: body };
  }

  private validatePayload(body: any, endpoint: any): boolean {
    if (endpoint.payloadJson) {
      for (const key of Object.keys(endpoint.payloadJson)) {
        if (endpoint.payloadJson[key].required && !body[key]) {
          return false;
        }
      }
    }
    return true;
  }

  private processResponse(endpoint: any): any {
    if (endpoint.responseType === 'ts' && typeof endpoint.response === 'string') {
      try {
        const processed = processFakerTemplate(endpoint.response);
        return processed;
      } catch {
        return endpoint.response;
      }
    }

    if (endpoint.storedData && endpoint.storedData.length > 0) {
      if (Array.isArray(endpoint.response)) {
        return endpoint.storedData;
      }
      return endpoint.storedData[endpoint.storedData.length - 1];
    }

    return processObject(endpoint.response);
  }

  public start(): Promise<void> {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, () => {
        console.log(`Mock server running on http://localhost:${this.port}`);
        resolve();
      });
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server) {
        this.server.close((err: any) => {
          if (err) reject(err);
          else resolve();
        });
      } else {
        resolve();
      }
    });
  }

  public getLogs(): RequestLog[] {
    return logger.getLogs();
  }

  public clearLogs(): void {
    logger.clear();
  }

  public getPort(): number {
    return this.port;
  }
}

export function startMockServer(config?: MockServerConfig): MockServer {
  const server = new MockServer(config);
  server.start();
  return server;
}

export function createMockServer(config?: MockServerConfig): MockServer {
  return new MockServer(config);
}
