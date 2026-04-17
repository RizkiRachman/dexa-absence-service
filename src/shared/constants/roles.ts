export const Role = {
  EMPLOYEE: 'employee',
  HR: 'hr',
} as const;

export type Role = typeof Role[keyof typeof Role];