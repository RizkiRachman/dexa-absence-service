import {NextApiRequest, NextApiResponse} from 'next';
import {authService} from '../services/auth.service';
import {ok} from '@/shared/dtos/response';
import {withErrorHandler} from '@/shared/middleware/error-handler.middleware';
import {LoginRequest} from "@/modules/auth/dtos/login.dto";
import {SUCCESS_MESSAGES} from "@/shared/utils/constant/responseMessages";

export const authController = {
    // Login
    login: withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
        const params = req.body as LoginRequest;
        const result = await authService.login(params);
        return ok(res, result);
    }),

    // Logout
    logout(_req: NextApiRequest, res: NextApiResponse) {
        return ok(res, {message: SUCCESS_MESSAGES.LOGOUT_SUCCESS});
    },
};
