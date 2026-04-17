import {
    formatDisplayDate,
    formatTime,
    formatTimestampToDate,
    formatTimestampToDateWithUndefined
} from "@/shared/utils/helper";
import {LeaveType} from "@prisma/client";

// Request DTO
export interface TapInOutCreateRequest {
    date: string;
    checkInTime?: string;
    checkOutTime?: string;
    notes?: string;
}

export interface TapInOutUpdateRequest {
    checkOutTime: string;
    notes?: string;
}

export interface LeaveCreateRequest {
    type: 'sick' | 'wfh' | 'annual_leave';
    startDate: string;
    endDate: string;
    notes?: string;
}

// --- Data DTO ---
export interface AbsenceCreateData {
    employeeId: string;
    date: Date;
    checkInTime?: Date;
    checkOutTime?: Date;
    notes?: string;
    leaveRequestId?: string;
}

export interface AbsenceUpdateData {
    id: string;
    employeeId: string;
    checkOutTime: Date;
    updatedAt: Date;
    notes?: string;
}

export interface LeaveRequestCreateData {
    employeeId: string;
    type: LeaveType;
    startDate: Date;
    endDate: Date;
    notes?: string;
}

// Builder
export function buildTapInOutCreateData(
    employeeId: string,
    input: TapInOutCreateRequest
): AbsenceCreateData {
    return {
        employeeId,
        date: new Date(input.date),
        checkInTime: formatTimestampToDateWithUndefined(input.checkInTime),
        checkOutTime: formatTimestampToDateWithUndefined(input.checkOutTime),
        notes: input.notes,
    };
}

export function buildTapInOutUpdateData(
    employeeId: string,
    input: TapInOutUpdateRequest,
    id: string
): AbsenceUpdateData {
    return {
        id,
        employeeId,
        checkOutTime: formatTimestampToDate(input.checkOutTime),
        updatedAt: new Date(),
        notes: input.notes,
    };
}

export function buildLeaveRequestCreateData(
    employeeId: string,
    input: LeaveCreateRequest
): LeaveRequestCreateData {
    return {
        employeeId,
        type: input.type,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
        notes: input.notes,
    };
}

export function buildLeaveAbsenceData(
    employeeId: string,
    leaveRequestId: string,
    startDate: Date,
    endDate: Date,
    notes?: string
): AbsenceCreateData[] {
    const absences: AbsenceCreateData[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        absences.push({
            employeeId,
            date: new Date(d),
            leaveRequestId,
            notes,
        });
    }
    return absences;
}


// --- Response DTOs ---

export interface AbsenceResponse {
    id: string;
    employeeId: string;
    date: string | null;
    checkInTime: string | null;
    checkOutTime: string | null;
    notes: string | null;
    leaveRequestId: string | null;
    leaveRequest: LeaveRequestResponse | null;
    createdAt: string;
    updatedAt: string;
}

export interface LeaveRequestResponse {
    id: string;
    employeeId: string;
    type: LeaveType;
    status: string;
    startDate: string | null;
    endDate: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ErrorAbsenceResponse {
    employeeId: string;
    date: string | null;
    createdAt: string;
    checkInTime: string | null;
    checkOutTime: string | null;
}

export function buildAbsenceResponse(absence: any): AbsenceResponse {
    return {
        id: absence.id,
        employeeId: absence.employeeId,
        date: formatDisplayDate(absence.date),
        checkInTime: absence.leaveRequest ? null : formatTime(absence.checkInTime),
        checkOutTime: absence.leaveRequest ? null : formatTime(absence.checkOutTime),
        notes: absence.notes ?? null,
        leaveRequestId: absence.leaveRequestId ?? null,
        leaveRequest: absence.leaveRequest ? buildLeaveRequestResponse(absence.leaveRequest) : null,
        createdAt: formatDisplayDate(absence.createdAt),
        updatedAt: formatDisplayDate(absence.updatedAt),
    };
}

export function buildLeaveRequestResponse(leaveRequest: any): LeaveRequestResponse {
    return {
        id: leaveRequest.id,
        employeeId: leaveRequest.employeeId,
        type: leaveRequest.type,
        status: leaveRequest.status,
        startDate: formatDisplayDate(leaveRequest.startDate),
        endDate: formatDisplayDate(leaveRequest.endDate),
        notes: leaveRequest.notes ?? null,
        createdAt: formatDisplayDate(leaveRequest.createdAt),
        updatedAt: formatDisplayDate(leaveRequest.updatedAt),
    };
}

export function buildErrorAbsenceDailyAttendanceResponse(absence: any): ErrorAbsenceResponse {
    const detail = buildAbsenceResponse(absence);
    return {
        employeeId: detail.employeeId,
        date: detail.date,
        createdAt: detail.createdAt,
        checkInTime: detail.checkInTime,
        checkOutTime: detail.checkOutTime,
    };
}