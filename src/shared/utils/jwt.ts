import jwt from 'jsonwebtoken';
import {JwtPayload} from '@/shared/dtos/dto';
import {TokenInvalidError, UnauthorizedError} from "@/shared/errors/exception";
import {CONSTANT} from "@/shared/utils/constant/common";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '5m';

export function signToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN} as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (e) {
        throw new TokenInvalidError();
    }
}

export function extractToken(authHeader: string | undefined): string {
    if (!authHeader?.startsWith(CONSTANT.BEARER_TOKEN_PREFIX)) throw new UnauthorizedError();
    try {
        return authHeader.split(CONSTANT.WHITESPACE)[1];
    } catch (e) {
        throw new TokenInvalidError();
    }
}

export function signServiceToken(): string {
    const payload: JwtPayload = {
        user_id: 'service',
        employee_id: 'service',
        role: 'hr',
        email: 'service@internal',
    };
    return jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN} as jwt.SignOptions);
}
