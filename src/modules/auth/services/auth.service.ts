import bcrypt from 'bcryptjs';
import {authRepository} from '../repositories/auth.repository';
import {signToken} from '@/shared/utils/jwt';
import {AccountDeactivatedError, InvalidCredentialsError} from '@/shared/errors/exception';
import {ERROR_MESSAGES} from "@/shared/utils/constant/responseMessages";
import {ObjectValidation} from "@/shared/utils/validation/objectValidation";
import {buildLoginResponse, LoginRequest, LoginResponse} from "@/modules/auth/dtos/login.dto";
import {User} from "@prisma/client";
import {buildJwtPayload} from "@/shared/dtos/dto";
import {tokenService} from "@/modules/auth/services/token.service";

export const authService = {

    async login(input: LoginRequest): Promise<LoginResponse> {
        const {email, password} = input;

        // Step 1: Find user by email
        const user = ObjectValidation.getOrThrowException(
            await authRepository.findByEmail(email),
            new InvalidCredentialsError(ERROR_MESSAGES.INVALID_CREDENTIALS)
        ) as User;

        // Step 2: Check active status (soft deleted employees cannot login)
        if (!user.isActive) throw new AccountDeactivatedError();

        // Step 3: Verify password
        ObjectValidation.getOrThrowException(
            await bcrypt.compare(password, user.passwordHash),
            new InvalidCredentialsError(ERROR_MESSAGES.INVALID_CREDENTIALS)
        )

        // Step 4: Get the employee record to obtain employee_id
        const bearer = tokenService.createBearerToken();
        const employee = await authRepository.findEmployeeByUserId(bearer, user.id)

        // Step 5: Sign JWT
        const token = signToken(buildJwtPayload(user, employee));

        return buildLoginResponse(token, user, employee);
    },

};
