import { NextApiResponse } from 'next';
import { AuthenticatedRequest, AuthHandler } from '@/shared/dtos/dto';
import { withAuth } from './auth.middleware';
import { forbidden } from '@/shared/dtos/response';
import { Role } from '@/shared/constants/roles';

export function withRole(role: Role, handler: AuthHandler) {
  return withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    if (req.user.role !== role) {
      return forbidden(res, `Access restricted to ${role} role`);
    }
    return handler(req, res);
  });
}
