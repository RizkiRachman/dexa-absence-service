export function getFirstDayOfMonth(): Date {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
}

export function getLastDayOfMonth(): Date {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 0);
}

export function formatTime(date: Date | null | undefined): string | null {
    if (!date) return null;
    return date.toTimeString().slice(0, 8); // "HH:mm:ss"
}

export function formatTimestampToDateWithUndefined(timestamp: string | undefined): Date | undefined {
    return timestamp ? new Date(`1970-01-01T${timestamp}`) : undefined;
}

export function formatTimestampToDate(timestamp: string): Date {
    return timestamp ? new Date(`1970-01-01T${timestamp}`) : new Date();
}

export function formatDisplayDate(date: Date): string {
    return date ? new Date(date).toISOString().split('T')[0] : "";
}

export function maskString(
    str: string,
    visibleStart = 2,
    visibleEnd = 2,
    maskChar = '*'
): string {
    if (str.length <= visibleStart + visibleEnd) return str;
    const start = str.slice(0, visibleStart);
    const end = str.slice(-visibleEnd);
    const masked = maskChar.repeat(str.length - visibleStart - visibleEnd);
    return start + masked + end;
}