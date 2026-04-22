import { type FC, type ReactNode, useMemo } from 'react'
import { toast } from 'sonner'

import type { AssetContextType, Files, Folders } from '../types/assets'
import { AssetContext } from '../hooks/useAsset'
import { useDeleteAsset, useDeleteFolder, useUpdateAsset, useUpdateFolder } from '../api/asset-actions'

interface AssetProviderProps {
    asset: Folders | Files
    type: 'FILE' | 'FOLDER'
    children: ReactNode
}

const AssetProvider: FC<AssetProviderProps> = ({ children, asset, type }) => {
    const { mutateAsync: updateAssetMutation } = useUpdateAsset()
    const { mutateAsync: updateFolderMutation } = useUpdateFolder()
    const { mutateAsync: deleteAssetMutation } = useDeleteAsset()
    const { mutateAsync: deleteFolderMutation } = useDeleteFolder()

    const value = useMemo(() => {
        if (!asset) return null

        const rename = async (newName: string) => {
            try {
                if (type === 'FILE') {
                    await updateAssetMutation({
                        projectId: asset.projectId,
                        assetId: asset.id,
                        data: { name: newName }
                    })
                } else {
                    await updateFolderMutation({
                        projectId: asset.projectId,
                        folderId: asset.id,
                        data: { name: newName }
                    })
                }
                toast.success('Renamed successfully')
            } catch (error) {
                toast.error('Failed to rename')
                throw error
            }
        }

        const move = async (targetParentId: string | null) => {
            try {
                if (type === 'FILE') {
                    await updateAssetMutation({
                        projectId: asset.projectId,
                        assetId: asset.id,
                        data: { folderId: targetParentId }
                    })
                } else {
                    await updateFolderMutation({
                        projectId: asset.projectId,
                        folderId: asset.id,
                        data: { parentId: targetParentId }
                    })
                }
                toast.success('Moved successfully')
            } catch (error) {
                toast.error('Failed to move')
                throw error
            }
        }

        const deleteItem = async () => {
            try {
                if (type === 'FILE') {
                    await deleteAssetMutation({
                        projectId: asset.projectId,
                        assetId: asset.id
                    })
                } else {
                    await deleteFolderMutation({
                        projectId: asset.projectId,
                        folderId: asset.id
                    })
                }
                toast.success('Deleted successfully')
            } catch (error) {
                toast.error('Failed to delete')
                throw error
            }
        }

        const contextValue: AssetContextType = {
            ...asset,
            assetName: asset.name,
            parentAssetId: type === 'FOLDER' ? (asset as Folders).parentId : (asset as Files).folderId,
            type,
            rename,
            move,
            delete: deleteItem
        }

        return contextValue
    }, [asset, type, updateAssetMutation, updateFolderMutation, deleteAssetMutation, deleteFolderMutation])

    return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>
}

export default AssetProvider
