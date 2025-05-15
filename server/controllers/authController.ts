import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as memoryStore from '../utils/memoryStore';

interface RequestWithAdmin extends Request {
  admin?: memoryStore.Admin;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Please provide username and password' });
      return;
    }

    const admin = await memoryStore.findAdminByUsername(username);
    if (!admin) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await memoryStore.verifyPassword(password, admin.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({
      username: admin.username,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const protect = async (
  req: RequestWithAdmin,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('Checking authorization header...');
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No token found in authorization header');
      res.status(401).json({ message: 'Not authorized, no token' });
      return;
    }

    const token = authHeader.split(' ')[1];
    console.log('Token found, verifying...');
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
      console.log('Token verified, username:', decoded.username);
      
      const admin = await memoryStore.findAdminByUsername(decoded.username);
      if (!admin) {
        console.log('Admin not found for username:', decoded.username);
        res.status(401).json({ message: 'Not authorized' });
        return;
      }
      
      req.admin = admin;
      console.log('Admin attached to request, proceeding...');
      next();
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Not authorized' });
  }
};

export const verifyToken = (
  req: RequestWithAdmin,
  res: Response,
  next: NextFunction
) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
        const admin = { username: decoded.username, password: '' } as memoryStore.Admin;
        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
}; 