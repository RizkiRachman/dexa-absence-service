import {ApplicationError, NotFoundError, ValidationError} from "@/shared/errors/exception";
import {ErrorDetail} from "@/shared/dtos/dto";
import {DEFAULT} from "@/shared/utils/constant/default";

export class ObjectValidation {
    static getOrThrowIfNotFound<T>(
        record: T | null | undefined,
        message: string
    ): T {
        if (!record) throw new NotFoundError(message);
        return record;
    }

    static throwsIfArraysIsNotEmpty(errors: ErrorDetail[] | null | undefined) {
        if (errors && errors.length > DEFAULT.DEFAULT_INDEX) throw new ValidationError(errors);
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

    static getOrReturnNull<T>(
        record: T | null | undefined,
    ): T | null {
        return record ?? null;
    }
}
