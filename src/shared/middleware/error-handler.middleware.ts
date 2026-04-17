import {NextApiRequest, NextApiResponse} from 'next';
import {ApplicationError} from '@/shared/errors/applicationError';
import {ApiHandler} from "@/shared/dtos/dto";

const isDev = process.env.NODE_ENV !== 'production';

export function handleError(err: unknown, req: NextApiRequest, res: NextApiResponse) {
    if (err instanceof ApplicationError) {
        return res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message,
                ...(err.details && err.details.length > 0 && {details: err.details}),
                data: err.data,
                timestamp: new Date().toISOString(),
                path: req.url ?? 'unknown',
                ...(isDev && err.stack && {stackTrace: err.stack.split('\n')}),
            },
        });
    }

    console.error('[UnhandledError]', err);
    const stack = err instanceof Error ? err.stack : undefined;
    return res.status(500).json({
        error: {
            code: 'INTERNAL_ERROR',
            message: 'Internal server error',
            timestamp: new Date().toISOString(),
            path: req.url ?? 'unknown',
            ...(isDev && stack && {stackTrace: stack.split('\n')}),
        },
    });
}

export function withErrorHandler(handler: ApiHandler) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            return await handler(req, res);
        } catch (err: unknown) {
            return handleError(err, req, res);
        }
    };
}
