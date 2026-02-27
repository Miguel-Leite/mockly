import { Router, Request, Response } from 'express';
import { authModel } from '../models/Auth';
import type { AuthSettings, AuthType, User } from '../types';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const isEnabled = authModel.isEnabled();
    if (!isEnabled) {
      return res.status(403).json({ error: 'Authentication is not enabled' });
    }

    const user = authModel.validateCredentials(username, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const authType = authModel.getAuthType();

    if (authType === 'jwt' || authType === 'bearer') {
      const jwtSecret = authModel.getJwtSecret();
      const jwtExpiry = authModel.getJwtExpiry();
      
      if (!jwtSecret) {
        return res.status(500).json({ error: 'JWT not configured' });
      }

      const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
      const payload = Buffer.from(JSON.stringify({
        sub: user.id,
        username: user.username,
        exp: Date.now() + parseExpiry(jwtExpiry),
      })).toString('base64url');
      const signature = Buffer.from(`${header}.${payload}.${jwtSecret}`).toString('base64url');
      
      const token = `${header}.${payload}.${signature}`;
      
      res.json({ token, user: { id: user.id, username: user.username } });
      return;
    }

    res.json({ user: { id: user.id, username: user.username }, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/register', (req: Request, res: Response) => {
  try {
    if (!authModel.isRegisterAllowed()) {
      return res.status(403).json({ error: 'Public registration is not allowed' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = authModel.createUser(username, password);
    res.status(201).json({ user: { id: user.id, username: user.username } });
  } catch (error) {
    if (error instanceof Error && error.message === 'Username already exists') {
      res.status(409).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/users', (_req: Request, res: Response) => {
  try {
    const users = authModel.getUsers();
    res.json(users.map(u => ({ id: u.id, username: u.username, createdAt: u.createdAt })));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/users', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = authModel.createUser(username, password);
    res.status(201).json({ user: { id: user.id, username: user.username } });
  } catch (error) {
    if (error instanceof Error && error.message === 'Username already exists') {
      res.status(409).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/users/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = authModel.deleteUser(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/endpoints', (_req: Request, res: Response) => {
  try {
    const endpoints = authModel.getAuthEndpoints();
    res.json(endpoints);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/settings', (_req: Request, res: Response) => {
  try {
    const settings = authModel.getSettings();
    const users = authModel.getUsers();
    res.json({ 
      ...settings, 
      users: users.map(u => ({ id: u.id, username: u.username, createdAt: u.createdAt })) 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/settings', (req: Request, res: Response) => {
  try {
    const updates = req.body as Partial<AuthSettings>;
    const settings = authModel.updateSettings(updates);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

function parseExpiry(expiry: string): number {
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) return 24 * 60 * 60 * 1000;
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 24 * 60 * 60 * 1000;
  }
}

export default router;
