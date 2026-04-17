import prisma from '@/lib/db';
import {cache} from "@/lib/cache";
import {DEFAULT} from "@/shared/utils/constant/default";
import {CONSTANT} from "@/shared/utils/constant/common";
import {ExternalServiceError} from "@/shared/errors/exception";
import {ERROR_MESSAGES} from "@/shared/utils/constant/responseMessages";

const BASE_URL = {
    EMPLOYEE: process.env.APP_EMPLOYEE_BASE_URL || 'http://localhost:3000',
} as const;

const PATH = {
    SEARCH_EMPLOYEE_BY_USER_ID: '/api/employees/search/user-id/',
} as const;

export const authRepository = {
    findByEmail(email: string) {
        return prisma.user.findUnique({
            where: {email},
        });
    },

    findById(id: string) {
        return prisma.user.findUnique({
            where: {id},
        });
    },

    async findEmployeeByUserId(bearerToken: string, userId: string) {
        const cacheKey = DEFAULT.CACHE_USER_EMPLOYEE_KEY_PREFIX.concat(userId);
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const path = BASE_URL.EMPLOYEE.concat(PATH.SEARCH_EMPLOYEE_BY_USER_ID).concat(userId);
        const res = await fetch(path,
            {headers: {Authorization: CONSTANT.BEARER_TOKEN_PREFIX.concat(bearerToken)}}
        );

        if (!res.ok) throw new ExternalServiceError(
            ERROR_MESSAGES.EXTERNAL_SERVICE_ERROR.concat(CONSTANT.COLON).concat(path),
            res.json()
        )

        const detail = res.json();
        cache.set(cacheKey, detail, DEFAULT.CACHE_TTL);
        return detail;
    },
};
