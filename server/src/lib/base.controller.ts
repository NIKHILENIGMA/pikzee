import { Request, Response, NextFunction } from 'express'
import { ApiResponse } from '@/util'

export abstract class BaseController {
    protected async handleRequest(
        req: Request,
        res: Response,
        next: NextFunction,
        action: () => Promise<{
            statusCode?: number
            message?: string
            data?: unknown
        }>
    ): Promise<void> {
        try {
            const result = await action()
            ApiResponse(req, res, result.statusCode || 200, result.message || 'Request successful', result.data)
        } catch (error) {
            next(error)
        }
    }
}
