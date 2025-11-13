export type Request = {
    ip: string
    method: string
    url: string
    'user-agent'?: string
}

export interface ApiResponse<T> {
    success: true
    statusCode: number
    request: Request
    message: string
    data: T
}

export interface ErrorResponse {
    success: false
    statusCode: number
    request: Request
    message: string
    data: null
    errors: Array<{ message: string }>
    trace: {
        error: string
    }
}
