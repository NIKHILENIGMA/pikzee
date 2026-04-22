import { Router } from 'express'
import { assetController } from './asset.module'

const router = Router({ mergeParams: true })

router.route('/').get(assetController.getFolderContents)
router.route('/presigned-url').post(assetController.generatePresignedUrl)
router.route('/confirm').post(assetController.confirmAssetUpload)
router.route('/folders').post(assetController.makeFolder)

router
    .route('/:assetId')
    .patch(assetController.updateAsset)
    .delete(assetController.deleteAsset)

router
    .route('/folders/:folderId')
    .patch(assetController.updateFolder)
    .delete(assetController.deleteFolder)

export default router

