export interface PaginatedResponse<T> {
    items: T[]
    cursor: string
    hasMore: boolean
}
