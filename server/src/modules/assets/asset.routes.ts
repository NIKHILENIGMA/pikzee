import { Router } from 'express'
import { assetController } from './asset.module'

const router = Router({ mergeParams: true })

router.route('/presigned-url').post(assetController.generatePresignedUrl)
router.route('/confirm').get(assetController.confirmAssetUpload)

// router.route('/').post(assetController.create).get(assetController.listAssetsByParentId)

// router.route('/confirm').get(assetController.confirmAssetUpload)
// router
//     .route('/:assetId')
//     .get(assetController.getAssetDetails)
//     .patch(assetController.renameAsset)
//     .delete(assetController.deleteAsset)

// router.route('/batch/move').post(assetController.moveAssets)

// router.route('/batch/copy').post(assetController.copyAssets)

// router.route('/batch/delete')
// .post(assetController.deleteAssets) // To be implemented

export default router
