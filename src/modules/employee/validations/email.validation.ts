import {ErrorDetail} from '@/shared/dtos/dto';
import {EmailDomains} from "@/shared/constants/emailDomains";

export class EmailValidation {
    readonly field: string;
    readonly email: string;

    constructor(email: string, field = 'email') {
        this.email = email;
        this.field = field;
    }

    static validate(email: string, field = 'email'): ErrorDetail | null {
        return new EmailValidation(email, field).validate();
    }

    validate(): ErrorDetail | null {
        if (!this.isNotEmpty()) return {field: this.field, message: 'Email is required'};
        if (!this.isAllowedDomain()) return {field: this.field, message: 'Email domain is not allowed'};
        if (!this.isValidFormat()) return {field: this.field, message: 'Email format is invalid'};
        if (!this.maxLength()) return {field: this.field, message: 'Email must not exceed 128 characters'};
        return null;
    }

    private isNotEmpty(): boolean {
        return !!this.email && this.email.length > 0;
    }

    private isValidFormat(): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(this.email);
    }

    private maxLength(): boolean {
        return !!this.email && this.email.length <= 128;
    }

    private isAllowedDomain(): boolean {
        if (!this.email) return false;
        return Object.values(EmailDomains)
            .some(domain => this.email.endsWith('@' + domain));
    }
}
