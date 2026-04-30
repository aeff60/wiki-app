import { verifyToken } from '../config/jwt.js';
import db from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export async function authenticate(req, _res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication required'));
  }

  try {
    const payload = verifyToken(header.split(' ')[1]);
    const user = await db('users').where({ id: payload.sub, is_active: true }).first();
    if (!user) return next(new ApiError(401, 'User not found'));
    req.user = user;
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token'));
  }
}
