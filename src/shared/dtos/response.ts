import {NextApiRequest, NextApiResponse} from 'next';
import {ErrorDetail} from '@/shared/dtos/dto';
import {ERROR_CODES, ErrorCode} from "@/shared/utils/constant/error-code";
import {PaginatedResult} from "@/shared/dtos/pagination";

export function ok<T>(res: NextApiResponse, data: T, status = 200) {
    return res.status(status).json(data);
}

export function okWithPagination<T>(res: NextApiResponse, result: PaginatedResult<T>, status = 200,) {
    return res.status(status).json(result);
}

export function created<T>(res: NextApiResponse, data: T) {
    return res.status(201).json(data);
}

/** 400 — General bad request (no field details). */
export function badRequest(res: NextApiResponse, message: string, req?: NextApiRequest) {
    return res.status(400).json(
        buildError(ERROR_CODES.BAD_REQUEST, message, getPath(req))
    );
}

/** 401 — Not logged in or token missing. */
export function unauthorized(res: NextApiResponse, message = 'Unauthorized', req?: NextApiRequest) {
    const code =
        message.includes('expired') ? ERROR_CODES.TOKEN_EXPIRED :
            message.includes('Invalid token') ? ERROR_CODES.TOKEN_INVALID :
                message.includes('credentials') || message.includes('email or password') ? ERROR_CODES.INVALID_CREDENTIALS :
                    ERROR_CODES.UNAUTHORIZED;

    return res.status(401).json(buildError(code, message, getPath(req)));
}

/** 403 — Logged in but wrong role. */
export function forbidden(res: NextApiResponse, message = 'Forbidden', req?: NextApiRequest) {
    return res.status(403).json(
        buildError(ERROR_CODES.FORBIDDEN, message, getPath(req))
    );
}

/** 404 — Resource not found. */
export function notFound(res: NextApiResponse, message = 'Not found', req?: NextApiRequest) {
    return res.status(404).json(
        buildError(ERROR_CODES.NOT_FOUND, message, getPath(req))
    );
}

/** 405 — HTTP method not supported. */
export function methodNotAllowed(res: NextApiResponse, req?: NextApiRequest) {
    return res.status(405).json(
        buildError(ERROR_CODES.METHOD_NOT_ALLOWED, 'Method not allowed', getPath(req))
    );
}

/** 500 — Unexpected server error. */
export function serverError(res: NextApiResponse, req?: NextApiRequest) {
    return res.status(500).json(
        buildError(ERROR_CODES.INTERNAL_ERROR, 'Internal server error', getPath(req))
    );
}

function getPath(req?: NextApiRequest): string {
    return req?.url ?? 'unknown';
}

function buildError(
    code: ErrorCode,
    message: string,
    path: string,
    details?: ErrorDetail[]
) {
    return {
        error: {
            code,
            message,
            ...(details && details.length > 0 && {details}),
            timestamp: new Date().toISOString(),
            path,
        },
    };
}