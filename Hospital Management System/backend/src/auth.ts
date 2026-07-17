// JWT login + refresh + a middleware that protects routes.
// This mirrors what @msbc/data-layer expects on the client:
//   - login returns { accessToken, refreshToken }
//   - the refresh endpoint takes { refreshToken } and returns a new accessToken
//   - protected routes need "Authorization: Bearer <accessToken>"

import type { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { users } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'hms-dev-secret-change-me';
const ACCESS_TTL = '15m';
const REFRESH_TTL = '7d';

export const authRouter = Router();

authRouter.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const payload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TTL });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TTL });
  res.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      doctorId: user.doctorId,
      patientId: user.patientId,
    },
  });
});

authRouter.post('/refresh', (req: Request, res: Response) => {
  // The token manager may name the field differently across versions, so accept
  // the common variants (and a raw Authorization header as a last resort).
  const body = req.body ?? {};
  const headerToken = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const refreshToken =
    body.refreshToken || body.refresh || body.token || body.refresh_token || headerToken;
  if (!refreshToken) return res.status(400).json({ message: 'refreshToken required' });
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as jwt.JwtPayload;
    const payload = { sub: decoded.sub, email: decoded.email, role: decoded.role };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TTL });
    // The data-layer token manager reads a snake_case `access_token` from the
    // refresh response; include both shapes to be safe.
    res.json({ access_token: accessToken, accessToken });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

/** Blocks any request without a valid Bearer access token. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token expired or invalid' });
  }
}
