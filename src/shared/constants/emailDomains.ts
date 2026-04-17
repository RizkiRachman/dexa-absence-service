export const EmailDomains = {
    DEXA_ID: 'dexa.co.id',
    DEXA_SALES_ID: 'dexa.sales.co.id',
    DEXA_INTERNATIONAL: 'dexa.com',
} as const;

export type EmailDomains = typeof EmailDomains[keyof typeof EmailDomains];