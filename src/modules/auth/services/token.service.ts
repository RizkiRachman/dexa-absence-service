import jwt from 'jsonwebtoken';
import {JwtPayload} from '@/shared/dtos/dto';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '5m';
const M2M_USER_ID = process.env.M2M_USER_ID || 'need to be init on env';
const M2M_EMPLOYEE_ID = process.env.M2M_EMPLOYEE_ID || 'need to be init on env';
const M2M_EMAIL = process.env.M2M_EMAIL || 'need to be init on env';


export const tokenService = {
    createBearerToken(): string {
        const payload: JwtPayload = {
            user_id: M2M_USER_ID,
            employee_id: M2M_EMPLOYEE_ID,
            role: 'hr',
            email: M2M_EMAIL,
        };
        return jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN} as jwt.SignOptions);
    }
}
