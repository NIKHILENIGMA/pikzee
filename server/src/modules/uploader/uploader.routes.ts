import { Router } from 'express'
import { uploaderController } from './uploader.module'
import { clerkMiddleware } from '@/middlewares/clerk/clerk.middleware'

const router = Router()

router
    .route('/plan-uploads')
    .post(clerkMiddleware, uploaderController.handlePlanUploads)
    
router
    .route('/generate-url')
    .post(clerkMiddleware, uploaderController.generateUploadUrl)

router.route('/finalize').post(clerkMiddleware, uploaderController.finalizeUpload)

export default router
