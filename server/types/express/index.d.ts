import { Express } from 'express-serve-static-core';
import { Admin } from '../../utils/memoryStore';

declare global {
  namespace Express {
    interface Request {
      admin?: Admin;
    }
  }
} 