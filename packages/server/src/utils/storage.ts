import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import type { MockEndpoint } from '../types';

interface StorageData {
  endpoints: MockEndpoint[];
}

const DEFAULT_DATA_DIR = path.join(os.homedir(), '.mockly');
const DEFAULT_FILE = 'endpoints.json';

export class Storage {
  private dataDir: string;
  private filePath: string;
  private data: StorageData;

  constructor() {
    this.dataDir = process.env.MOCKLY_DATA_DIR || DEFAULT_DATA_DIR;
    this.filePath = path.join(this.dataDir, DEFAULT_FILE);
    this.data = { endpoints: [] };
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
      this.data = { endpoints: [] };
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

  getFilePath(): string {
    return this.filePath;
  }
}

export const storage = new Storage();
