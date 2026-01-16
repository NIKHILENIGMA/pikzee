import { NextFunction, Request, Response } from 'express'
import { BaseController } from '@/lib'
import { STATUS_CODE, SuccessResponse } from '@/types/api/success.types'
import { UnauthorizedError } from '@/util'

export class UploaderController extends BaseController {
    constructor() {
        super()
    }

    handlePlanUploads = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            await new Promise((resolve) => setTimeout(resolve, 100)) // Simulate async operation

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Plan uploads handled successfully',
                data: null
            })
        })
    }
    generateUploadUrl = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            await new Promise((resolve) => setTimeout(resolve, 100)) // Simulate async operation
            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Upload URL generated successfully',
                data: null
            })
        })
    }

    finalizeUpload = async (req: Request, res: Response, next: NextFunction) => {
        return this.handleRequest(req, res, next, async (): Promise<SuccessResponse<null>> => {
            const userId: string | undefined = req.user?.id
            if (!userId) {
                throw new UnauthorizedError('User not authenticated')
            }

            await new Promise((resolve) => setTimeout(resolve, 100)) // Simulate async operation

            return this.createResponse({
                statusCode: STATUS_CODE.OK,
                message: 'Upload finalized successfully',
                data: null
            })
        })
    }
}

