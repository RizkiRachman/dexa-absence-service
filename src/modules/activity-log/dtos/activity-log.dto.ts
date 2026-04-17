export type ActivityAction = 'CREATE' | 'UPDATE' | 'DELETE';

export type ActivityType = 'employee' | 'daily_attendance' | 'leave_request' | 'password_change' | 'absence';

// Payload published to RabbitMQ queue
export interface ActivityLogRequest {
    employeeId: string;
    action: ActivityAction;
    type: ActivityType;
    referenceId?: string | null;
    dataBefore?: object | null;
    dataAfter?: object | null;
}

// Data shape passed to the database insert
export interface ActivityLogInsert {
    employeeId: string;
    action: ActivityAction;
    type: ActivityType;
    referenceId: string | null;
    dataBefore: object | null;
    dataAfter: object | null;
}

// Raw record returned from the database
export interface ActivityLogRecord {
    id: string;
    createdAt: Date;
    employeeId: string;
    action: string;
    type: string;
    referenceId: string | null;
    dataBefore: object | null;
    dataAfter: object | null;
}

// Response shape sent to the frontend
export interface ActivityLogResponse {
    id: string;
    createdAt: string;
    employeeId: string;
    action: ActivityAction;
    type: ActivityType;
    referenceId: string | null;
    dataBefore: object | null;
    dataAfter: object | null;
}

export function buildActivityLogInsert(request: ActivityLogRequest): ActivityLogInsert {
    return {
        employeeId: request.employeeId,
        action: request.action,
        type: request.type,
        referenceId: request.referenceId ?? null,
        dataBefore: request.dataBefore ?? null,
        dataAfter: request.dataAfter ?? null,
    };
}

export function buildActivityLogResponse(record: ActivityLogRecord): ActivityLogResponse {
    return {
        id: record.id,
        createdAt: new Date(record.createdAt).toISOString(),
        employeeId: record.employeeId,
        action: record.action as ActivityAction,
        type: record.type as ActivityType,
        referenceId: record.referenceId,
        dataBefore: record.dataBefore,
        dataAfter: record.dataAfter,
    };
}