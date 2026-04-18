export const DEFAULT = {
    CACHE_EMPLOYEE_PROFILE_KEY_PREFIX: 'employee:profile:',
    CACHE_USER_EMPLOYEE_KEY_PREFIX: 'user:employee:profile:',
    DEFAULT_PASSWORD: 'password',
    DEFAULT_PASSWORD_SALT: 10,
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_LIMIT: 10,
    DEFAULT_MAX_PAGE_LIMIT: 100,
    CACHE_TTL: 60_000,
    DEFAULT_INDEX: 0,
    DEFAULT_SALT: 10,
} as const;

export type DEFAULT = typeof DEFAULT[keyof typeof DEFAULT];

export const ROLES = {
    HR: 'hr',
    EMPLOYEE: 'employee',
} as const;

export type ROLES = typeof ROLES[keyof typeof ROLES];
