// src/types/express.d.ts
import { Request } from 'express';
import { AdminInterface } from './interfaces/admin.interface';

declare global {
  namespace Express {
    interface Request {
      user?: AdminInterface; // Make it optional if it's not always present
    }
  }
}
