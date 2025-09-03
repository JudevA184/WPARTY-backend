import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = bearer.split(' ')[1];

  // Add this check to make sure the token exists
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token malformed' });
  }

  try {
    const payload = jwt.verify(token, 'YOUR_SUPER_SECRET_KEY') as unknown as UserPayload;
    
    req.user = payload;
    next();
  } catch (e) {
    console.error(e);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};