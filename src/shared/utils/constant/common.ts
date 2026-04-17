export const CONSTANT = {
    WHITESPACE: ' ',
    EMPTY_STRING: '',
    COLON: ' : ',
    BEARER_TOKEN_PREFIX: 'Bearer ',
} as const;

export type CONSTANT = typeof CONSTANT[keyof typeof CONSTANT];

export const FIELD = {
    PASSWORD: 'password'
} as const;

export type FILED = typeof FIELD[keyof typeof FIELD];