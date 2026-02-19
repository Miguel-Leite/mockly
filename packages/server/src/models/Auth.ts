import { v4 as uuidv4 } from 'uuid';
import { storage } from '../utils/storage';
import type { AuthSettings, User, AuthType, MockEndpoint } from '../types';

const DEFAULT_AUTH_SETTINGS: AuthSettings = {
  enabled: false,
  type: 'jwt',
  jwtSecret: '',
  jwtExpiry: '24h',
  allowRegister: false,
};

const AUTH_ENDPOINTS: Omit<MockEndpoint, 'id' | 'createdAt'>[] = [
  {
    path: '/auth/login',
    method: 'POST',
    response: { message: 'Login endpoint', token: 'jwt-token' },
    responseType: 'json',
    delay: 0,
    authRequired: false,
  },
  {
    path: '/auth/register',
    method: 'POST',
    response: { message: 'Register endpoint' },
    responseType: 'json',
    delay: 0,
    authRequired: false,
  },
  {
    path: '/auth/me',
    method: 'GET',
    response: { message: 'Current user info', user: { id: '', username: '' } },
    responseType: 'json',
    delay: 0,
    authRequired: true,
  },
];

export class AuthModel {
  private settings: AuthSettings;
  private users: Map<string, User>;

  constructor() {
    const storedSettings = storage.getAuthSettings();
    this.settings = storedSettings || DEFAULT_AUTH_SETTINGS;
    
    const storedUsers = storage.getUsers();
    this.users = new Map(storedUsers.map(u => [u.id, u]));
  }

  getSettings(): AuthSettings {
    return this.settings;
  }

  updateSettings(settings: Partial<AuthSettings>): AuthSettings {
    const wasEnabled = this.settings.enabled;
    const newEnabled = settings.enabled !== undefined ? settings.enabled : this.settings.enabled;
    
    this.settings = { ...this.settings, ...settings };
    storage.setAuthSettings(this.settings);
    
    if (!wasEnabled && newEnabled) {
      this.ensureAuthEndpoints();
    } else if (wasEnabled && !newEnabled) {
      this.removeAuthEndpoints();
      this.clearUsers();
    }
    
    return this.settings;
  }

  private ensureAuthEndpoints(): void {
    const endpoints = storage.getEndpoints();
    const existingPaths = new Set(endpoints.map(e => `${e.method}:${e.path}`));
    
    for (const endpoint of AUTH_ENDPOINTS) {
      const key = `${endpoint.method}:${endpoint.path}`;
      if (!existingPaths.has(key)) {
        const newEndpoint: MockEndpoint = {
          ...endpoint,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        };
        storage.addEndpoint(newEndpoint);
      }
    }
  }

  private removeAuthEndpoints(): void {
    const endpoints = storage.getEndpoints();
    const authEndpointIds = endpoints
      .filter(e => e.path.startsWith('/auth/') && ['login', 'register', 'me'].some(p => e.path.endsWith(p)))
      .map(e => e.id);
    
    for (const id of authEndpointIds) {
      storage.deleteEndpoint(id);
    }
  }

  private clearUsers(): void {
    const users = storage.getUsers();
    for (const user of users) {
      storage.deleteUser(user.id);
    }
    this.users.clear();
  }

  getAuthEndpoints(): MockEndpoint[] {
    const endpoints = storage.getEndpoints();
    return endpoints.filter(e => 
      e.path.startsWith('/auth/') && ['login', 'register', 'me'].some(p => e.path.endsWith(p))
    );
  }

  getUsers(): User[] {
    return Array.from(this.users.values());
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByUsername(username: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  createUser(username: string, password: string): User {
    const existing = this.getUserByUsername(username);
    if (existing) {
      throw new Error('Username already exists');
    }

    const user: User = {
      id: uuidv4(),
      username,
      password: this.hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    
    this.users.set(user.id, user);
    storage.addUser(user);
    return { ...user, password: '***' };
  }

  deleteUser(id: string): boolean {
    const deleted = this.users.delete(id);
    if (deleted) {
      storage.deleteUser(id);
    }
    return deleted;
  }

  validateCredentials(username: string, password: string): User | null {
    const user = this.getUserByUsername(username);
    if (!user) {
      return null;
    }

    if (this.verifyPassword(password, user.password)) {
      return { ...user, password: '***' };
    }
    return null;
  }

  isEnabled(): boolean {
    return this.settings.enabled;
  }

  getAuthType(): AuthType {
    return this.settings.type;
  }

  getJwtSecret(): string | undefined {
    return this.settings.jwtSecret;
  }

  getJwtExpiry(): string {
    return this.settings.jwtExpiry;
  }

  getApiKey(): string | undefined {
    return this.settings.apiKey;
  }

  isRegisterAllowed(): boolean {
    return this.settings.allowRegister && this.settings.enabled;
  }

  private hashPassword(password: string): string {
    return Buffer.from(password).toString('base64');
  }

  private verifyPassword(password: string, hash: string): boolean {
    return Buffer.from(password).toString('base64') === hash;
  }
}

export const authModel = new AuthModel();
