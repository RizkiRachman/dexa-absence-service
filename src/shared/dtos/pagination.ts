import {DEFAULT} from "@/shared/utils/constant/default";

export interface PaginationParamsRequest {
    page?: number
    limit?: number
}

export interface PaginationParams {
    page: number
    limit: number
    skip: number
    take: number
}

export interface PaginationMeta {
    page: number
    limit: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

export interface PaginatedResult<T> {
    data: T[]
    meta: PaginationMeta
}

export function getPaginationParams(params: PaginationParamsRequest): PaginationParams {

    const page = Math.max(DEFAULT.DEFAULT_PAGE, Number(params.page) || DEFAULT.DEFAULT_PAGE)
    const limit = Math.min(DEFAULT.DEFAULT_MAX_PAGE_LIMIT, Number(params.limit) || DEFAULT.DEFAULT_PAGE_LIMIT)

    const skip = (page - DEFAULT.DEFAULT_PAGE) * limit
    const take = limit

    return {
        page,
        limit,
        skip,
        take
    }
}

export function buildWhereClause(filter: Record<string, any>): Record<string, any> {
    const where: Record<string, any> = {}

    for (const [key, val] of Object.entries(filter)) {
        if (typeof val === 'object' && val !== null) {
            where[key] = val
        } else {
            where[key] = {equals: val}
        }
    }

    return where
}

export function buildPaginatedResult<T>(
    data: T[],
    totalItems: number,
    page: number,
    limit: number
): PaginatedResult<T> {
    const totalPages = Math.ceil(totalItems / limit)

    return {
        data,
        meta: {
            page,
            limit,
            totalItems,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    }
}