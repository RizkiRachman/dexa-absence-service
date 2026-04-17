export const ERROR_MESSAGES = {
    UNAUTHORIZED: 'You are not authorized to access this resource',
    UNAUTHORIZED_GET_OTHER_EMPLOYEE_DETAILS: 'You can only access your own profile',
    UNAUTHORIZED_CHANGE_PASSWORD: 'You are not authorized to change password, only employee with same employeeId can change password',
    EMPLOYEE_NOT_FOUND: 'Employee record not found',
    USER_NOT_FOUND: 'User record not found',
    EMPLOYEE_ABSENCE_NOT_FOUND: 'User employee absence record not found',
    LEAVE_REQUEST_NOT_FOUND: 'User employee leave request not found',
    USER_PASSWORD_INCORRECT: 'Current password is incorrect',
    USER_PASSWORD_TOO_SHORT: 'New password must be at least 6 characters',
    METHOD_NOT_ALLOWED: 'Method not allowed',
    NOT_FOUND: 'Resource not found',
    FORBIDDEN: 'Forbidden',
    INTERNAL_ERROR: 'Internal server error',
    VALIDATION_ERROR: 'Validation error',
    CONFLICT: 'Conflict',
    TOKEN_EXPIRED: 'Token expired',
    TOKEN_INVALID: 'Token invalid',
    INVALID_CREDENTIALS: 'Invalid credentials, please check your email and password',
    BAD_REQUEST: 'Bad request',
    DEFAULT_PASSWORD: 'Default password is not allowed, please change password first',
    EMPLOYEE_ALREADY_DELETED: 'Employee is already deactivated',
    USERNAME_IS_ALREADY_EXIST: 'Email or username is already exist, please use another email or username',
    EXTERNAL_SERVICE_ERROR: 'External service error',
    LEAVE_REQUEST_ALREADY_EXIST: 'You already have an existing leave request with the selected date range',
    ABSENCE_NOT_FOUND: 'User employee absence record not found',
} as const;

export type ERROR_MESSAGES = typeof ERROR_MESSAGES[keyof typeof ERROR_MESSAGES];

export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    DELETE_SUCCESS: 'Delete successful',
    UPDATE_SUCCESS: 'Update successful',
    CREATE_SUCCESS: 'Create successful',
    CHANGE_PASSWORD_SUCCESS: 'Password changed successfully',
} as const;

export type SUCCESS_MESSAGES = typeof SUCCESS_MESSAGES[keyof typeof SUCCESS_MESSAGES];
