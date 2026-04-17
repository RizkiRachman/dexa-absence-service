export const QueueConfig = {
    QUEUE_ACTIVITY_LOG: 'activity.log',
} as const;

export type QueueConfig = typeof QueueConfig[keyof typeof QueueConfig];

export const ActivityLogType = {
    EMPLOYEES: 'employee',
    PASSWORD: 'password_change',
    DAILY_ATTENDANCE: 'daily_attendance',
    LEAVE_REQUEST: 'leave_request',
    ABSENCE: 'absence',
} as const;

export type ActivityLogType = typeof ActivityLogType[keyof typeof ActivityLogType];

export const ActivityLogAction = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
} as const;

export type ActivityLogAction = typeof ActivityLogAction[keyof typeof ActivityLogAction];
