import { ApiError } from '../utils/ApiError.js';

const ROLE_LEVEL = { viewer: 1, editor: 2, admin: 3 };

export function authorize(minRole) {
  return (req, _res, next) => {
    const userLevel = ROLE_LEVEL[req.user?.role] ?? 0;
    if (userLevel >= ROLE_LEVEL[minRole]) return next();
    next(new ApiError(403, 'Insufficient permissions'));
  };
}
