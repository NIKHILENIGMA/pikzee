import { Router } from 'express'
import { assetController } from './asset.module'

const router = Router({ mergeParams: true })

router.route('/').post(assetController.create).get(assetController.listAssetsByParentId)

router
    .route('/:assetId')
    .get(assetController.getAssetDetails)
    .patch(assetController.renameAsset)
    .delete(assetController.deleteAsset)

router.route('/batch/move').post(assetController.moveAssets)

router.route('/batch/copy').post(assetController.copyAssets)

router.route('/batch/delete')
// .post(assetController.deleteAssets) // To be implemented

export default router
