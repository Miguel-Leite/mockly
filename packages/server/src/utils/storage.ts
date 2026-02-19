import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import type { MockEndpoint, Schema } from '../types';

interface StorageData {
  endpoints: MockEndpoint[];
  schemas: Schema[];
}

const DEFAULT_DATA_DIR = path.join(os.homedir(), '.mockly');
const DEFAULT_FILE = 'data.json';

export class Storage {
  private dataDir: string;
  private filePath: string;
  private data: StorageData;

  constructor() {
    this.dataDir = process.env.MOCKLY_DATA_DIR || DEFAULT_DATA_DIR;
    this.filePath = path.join(this.dataDir, DEFAULT_FILE);
    this.data = { endpoints: [], schemas: [] };
    this.ensureDataDir();
    this.load();
  }

  private ensureDataDir(): void {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private load(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const content = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(content);
      } else {
        this.save();
      }
    } catch (error) {
      console.warn('[Storage] Failed to load data, using empty state:', error);
      this.data = { endpoints: [], schemas: [] };
    }
  }

  private save(): void {
    try {
      this.ensureDataDir();
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (error) {
      console.warn('[Storage] Failed to save data:', error);
    }
  }

  getEndpoints(): MockEndpoint[] {
    return this.data.endpoints;
  }

  setEndpoints(endpoints: MockEndpoint[]): void {
    this.data.endpoints = endpoints;
    this.save();
  }

  addEndpoint(endpoint: MockEndpoint): void {
    this.data.endpoints.push(endpoint);
    this.save();
  }

  updateEndpoint(id: string, endpoint: MockEndpoint): void {
    const index = this.data.endpoints.findIndex(ep => ep.id === id);
    if (index !== -1) {
      this.data.endpoints[index] = endpoint;
      this.save();
    }
  }

  deleteEndpoint(id: string): void {
    this.data.endpoints = this.data.endpoints.filter(ep => ep.id !== id);
    this.save();
  }

  clear(): void {
    this.data.endpoints = [];
    this.save();
  }

  // Schema methods
  getSchemas(): Schema[] {
    return this.data.schemas || [];
  }

  getSchema(id: string): Schema | undefined {
    return this.data.schemas.find(s => s.id === id);
  }

  addSchema(schema: Schema): void {
    this.data.schemas.push(schema);
    this.save();
  }

  updateSchema(id: string, schema: Schema): void {
    const index = this.data.schemas.findIndex(s => s.id === id);
    if (index !== -1) {
      this.data.schemas[index] = schema;
      this.save();
    }
  }

  deleteSchema(id: string): void {
    this.data.schemas = this.data.schemas.filter(s => s.id !== id);
    this.save();
  }

  updateTablePosition(schemaId: string, tableId: string, position: { x: number; y: number }): void {
    const schema = this.data.schemas.find(s => s.id === schemaId);
    if (schema) {
      const table = schema.tables.find(t => t.id === tableId);
      if (table) {
        table.position = position;
        this.save();
      }
    }
  }

  getFilePath(): string {
    return this.filePath;
  }
}

export const storage = new Storage();
