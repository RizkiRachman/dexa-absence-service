import {NextApiRequest, NextApiResponse} from 'next';

export interface JwtPayload {
    user_id: string;
    employee_id: string;
    role: 'employee' | 'hr';
    email: string;
}


export interface AuthenticatedRequest extends NextApiRequest {
    user: JwtPayload;
}

export function buildJwtPayload(
    user: { id: string, role: 'employee' | 'hr', email: string },
    employee: { id: string }
): JwtPayload {
    return {
        user_id: user.id,
        employee_id: employee.id,
        role: user.role,
        email: user.email,

    };
}

export interface ErrorDetail {
    field: string;
    message: string;
}

export type AuthHandler = (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void> | void;

export type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;
