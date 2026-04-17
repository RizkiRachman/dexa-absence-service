import {ErrorCode} from '@/shared/utils/constant/error-code';
import {ErrorDetail} from "@/shared/dtos/dto";

export class ApplicationError extends Error {
    public readonly statusCode: number;
    public readonly code: ErrorCode;
    public readonly details?: ErrorDetail[];
    public readonly data?: any;

    constructor(statusCode: number, code: ErrorCode, message: string, details?: ErrorDetail[], data?: any) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.data = data;
        Object.setPrototypeOf(this, new.target.prototype);
    }

}
