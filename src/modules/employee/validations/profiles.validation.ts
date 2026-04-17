import {UpdateProfileInput} from '../dtos/profiles.dto';
import {ErrorDetail} from '@/shared/dtos/dto';
import {ObjectValidation} from '@/shared/utils/validation/objectValidation';
import {ImageValidation} from "@/modules/employee/validations/image.validation";

export class UpdateProfileValidation {
    private readonly input: UpdateProfileInput;

    constructor(input: UpdateProfileInput) {
        this.input = input;
    }

    validate(): ErrorDetail[] {
        const errors: ErrorDetail[] = [];

        if (!this.input.phoneNumber && !this.input.profilePic) {
            errors.push({
                field: 'phoneNumber | profilePic',
                message: 'phoneNumber or profile picture is required'
            });
        }

        if (this.input.profilePic) {
            const imageError = ImageValidation.validate(this.input.profilePic, 'profilePic');
            if (imageError) errors.push(imageError);
        }

        return errors;
    }

    static validateOrThrow(input: UpdateProfileInput): void {
        ObjectValidation.throwsIfArraysIsNotEmpty(new UpdateProfileValidation(input).validate());
    }
}