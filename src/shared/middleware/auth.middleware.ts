import {NextApiResponse} from 'next';
import {AuthenticatedRequest, AuthHandler} from '@/shared/dtos/dto';
import {extractToken, verifyToken} from '@/shared/utils/jwt';
import {handleError} from './error-handler.middleware';

export function withAuth(handler: AuthHandler) {
    return async (req: AuthenticatedRequest, res: NextApiResponse) => {
        try {
            const token = extractToken(req.headers.authorization);
            req.user = verifyToken(token);
            return await handler(req, res);
        } catch (err: unknown) {
            return handleError(err, req, res);
        }
    };
}
