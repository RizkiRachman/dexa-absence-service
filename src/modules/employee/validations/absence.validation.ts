import {ErrorDetail} from '@/shared/dtos/dto';
import {ObjectValidation} from '@/shared/utils/validation/objectValidation';
import {LeaveCreateRequest, TapInOutCreateRequest} from "@/modules/employee/dtos/absences.dto";
import {LeaveType} from "@prisma/client";
import {formatDisplayDate} from "@/shared/utils/helper";

function isInvalidDateFormat(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return true;
    const date = new Date(value);
    return date.toString() === 'Invalid Date';
}

function isInvalidTime(value: string): boolean {
    return !/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(value);
}

export class TapInOutValidation {
    private readonly request: TapInOutCreateRequest;

    constructor(request: TapInOutCreateRequest) {
        this.request = request;
    }

    private validate(): ErrorDetail[] {
        const errors: ErrorDetail[] = [];

        if (!this.request.date) {
            errors.push({field: 'date', message: 'Date is required'});
        } else if (isInvalidDateFormat(this.request.date)) {
            errors.push({field: 'date', message: 'Invalid date, format yyyy-mm-dd'});
        } else {
            const requestDate = formatDisplayDate(new Date(this.request.date));
            const today = formatDisplayDate(new Date());
            if (requestDate !== today) {
                errors.push({field: 'date', message: 'Date should not be after or before today'});
            }
        }

        if (!this.request.checkInTime && !this.request.checkOutTime) {
            errors.push({
                field: 'checkInTime',
                message: 'Check-in or check-out time should be provided'
            });
        }


        if (this.request.checkInTime && isInvalidTime(this.request.checkInTime)) {
            errors.push({field: 'checkInTime', message: 'Invalid check-in time, format HH:mm or HH:mm:ss'});
        }

        if (this.request.checkOutTime && isInvalidTime(this.request.checkOutTime)) {
            errors.push({field: 'checkOutTime', message: 'Invalid check-out time, format HH:mm or HH:mm:ss'});
        }

        if (this.request.checkInTime && this.request.checkOutTime && this.request.checkInTime >= this.request.checkOutTime) {
            errors.push({field: 'checkInTime', message: 'Check-in time should be before check-out time'});
        }

        if (this.request.checkInTime && this.request.checkOutTime && this.request.checkOutTime < this.request.checkInTime) {
            errors.push({field: 'checkOutTime', message: 'Check-out time should be after check-in time'});
        }
        return errors;
    }

    static validateOrThrow(request: TapInOutCreateRequest): void {
        ObjectValidation.throwsIfArraysIsNotEmpty(new TapInOutValidation(request).validate());
    }
}

export class LeaveValidation {
    private readonly request: LeaveCreateRequest;

    constructor(request: LeaveCreateRequest) {
        this.request = request;
    }

    private isValidType(): boolean {
        return Object.values(LeaveType).includes(this.request.type);
    }

    private validate(): ErrorDetail[] {
        const errors: ErrorDetail[] = [];

        if (!this.isValidType()) {
            errors.push({field: 'type', message: 'Invalid leave type'});
            return errors;
        }

        if (!this.request.startDate) {
            errors.push({field: 'startDate', message: 'Start date is required for leave requests'});
        } else if (isInvalidDateFormat(this.request.startDate)) {
            errors.push({field: 'startDate', message: 'Invalid start date, format yyyy-mm-dd'});
        }

        if (!this.request.endDate) {
            errors.push({field: 'endDate', message: 'End date is required for leave requests'});
        } else if (isInvalidDateFormat(this.request.endDate)) {
            errors.push({field: 'endDate', message: 'Invalid end date, format yyyy-mm-dd'});
        }

        console.log('startDate', this.request.startDate, 'endDate', this.request.endDate);
        if (this.request.startDate && this.request.endDate) {
            if (isInvalidDateFormat(this.request.startDate) || isInvalidDateFormat(this.request.endDate)) {
                return errors;
            }

            const start = new Date(this.request.startDate);
            const end = new Date(this.request.endDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (start > end) {
                errors.push({field: 'startDate', message: 'Start date should be before end date'});
            }

            if (start < today) {
                errors.push({field: 'startDate', message: 'Start date should be after today'});
            }

            if (end < today) {
                errors.push({field: 'endDate', message: 'End date should be after today'});
            }
        }

        return errors;
    }

    static validateOrThrow(request: LeaveCreateRequest): void {
        ObjectValidation.throwsIfArraysIsNotEmpty(new LeaveValidation(request).validate());
    }
}