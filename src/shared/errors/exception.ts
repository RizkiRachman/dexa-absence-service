import {ERROR_CODES} from '@/shared/utils/constant/error-code';
import {ApplicationError} from './applicationError';
import {ErrorDetail} from "@/shared/dtos/dto";

/** 400 — Bad Request */
export class BadRequestError extends ApplicationError {
    constructor(message = 'Bad request', details?: ErrorDetail[], data?: any) {
        super(400, ERROR_CODES.BAD_REQUEST, message, details, data);
    }
}

/** 401 — Invalid Credentials */
export class InvalidCredentialsError extends ApplicationError {
    constructor(message = 'Invalid email or password') {
        super(401, ERROR_CODES.INVALID_CREDENTIALS, message);
    }
}

/** 401 — Account Deactivated */
export class AccountDeactivatedError extends ApplicationError {
    constructor(message = 'Account is deactivated') {
        super(401, ERROR_CODES.UNAUTHORIZED, message);
    }
}

/** 401 — Token Expired */
export class TokenExpiredError extends ApplicationError {
    constructor(message = 'Token expired') {
        super(401, ERROR_CODES.TOKEN_EXPIRED, message);
    }
}

/** 401 — Token Invalid */
export class TokenInvalidError extends ApplicationError {
    constructor(message = 'Invalid token') {
        super(401, ERROR_CODES.TOKEN_INVALID, message);
    }
}

/** 401 — Unauthorized (generic) */
export class UnauthorizedError extends ApplicationError {
    constructor(message = 'Unauthorized') {
        super(401, ERROR_CODES.UNAUTHORIZED, message);
    }
}

/** 403 — Forbidden */
export class ForbiddenError extends ApplicationError {
    constructor(message = 'Forbidden') {
        super(403, ERROR_CODES.FORBIDDEN, message);
    }
}

/** 404 — Not Found */
export class NotFoundError extends ApplicationError {
    constructor(message = 'Not found') {
        super(404, ERROR_CODES.NOT_FOUND, message);
    }
}

/** 409 — Conflict */
export class ConflictError extends ApplicationError {
    constructor(message = 'Conflict') {
        super(409, ERROR_CODES.CONFLICT, message);
    }
}

export class ValidationError extends ApplicationError {
    constructor(detail?: ErrorDetail[]) {
        super(400, ERROR_CODES.VALIDATION_ERROR, 'Invalid request data', detail);
    }
}

export class ExternalServiceError extends ApplicationError {
    constructor(message = 'External service error', data?: any) {
        super(500, ERROR_CODES.EXTERNAL_SERVICE_ERROR, message, data);
    }
}

export {ApplicationError};
