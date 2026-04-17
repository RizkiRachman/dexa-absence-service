import {ApplicationError, NotFoundError, ValidationError} from "@/shared/errors/exception";
import {ErrorDetail} from "@/shared/dtos/dto";

export class ObjectValidation {
    static getOrThrowIfNotFound<T>(
        record: T | null | undefined,
        message = 'Not found'
    ): T {
        if (!record) throw new NotFoundError(message);
        return record;
    }

    static throwsIfArraysIsNotEmpty(errors: ErrorDetail[] | null | undefined) {
        if (errors && errors.length > 0) throw new ValidationError(errors);
    }

    static getOrThrowException<T>(
        record: T | null | undefined,
        exception: ApplicationError
    ): T {
        if (!record) throw exception;
        return record;
    }

    static throwExceptionIfExist<T>(
        record: T | null | undefined,
        exception: ApplicationError
    ) {
        if (record) throw exception
    }
}
