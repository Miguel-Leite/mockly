import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { endpointModel } from './models/Endpoint';
import { processObject } from './utils/faker';
import { logger } from './utils/logger';
import mockRoutes from './routes/mockRoutes';
import { MockServerConfig, HttpMethod, RequestLog } from './types';

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
      const endpoint = endpointModel.findByPath(req.path, req.method as HttpMethod);

      if (!endpoint) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }

      if (endpoint.delay && endpoint.delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, endpoint.delay));
      }

      const processedResponse = processObject(endpoint.response);
      res.json(processedResponse);
    });
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
