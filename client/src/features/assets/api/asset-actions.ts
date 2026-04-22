import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ASSETS_API_BASE, PROJECTS_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import type { MutationConfig } from '@/shared/lib/react-query'

// --- UPDATE ASSET (Rename/Move) ---
export const updateAsset = async ({
    projectId,
    assetId,
    data
}: {
    projectId: string
    assetId: string
    data: { name?: string; folderId?: string | null }
}): Promise<void> => {
    await client.patch<void, { name?: string; folderId?: string | null }>(`${PROJECTS_API_BASE}/${projectId}${ASSETS_API_BASE}/${assetId}`, data)
}

type UseUpdateAssetOptions = {
    mutationConfig?: MutationConfig<typeof updateAsset>
}

export const useUpdateAsset = ({ mutationConfig }: UseUpdateAssetOptions = {}) => {
    const queryClient = useQueryClient()

    return useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folder-contents'] })
        },
        ...mutationConfig,
        mutationFn: updateAsset
    })
}

// --- UPDATE FOLDER (Rename/Move) ---
export const updateFolder = async ({
    projectId,
    folderId,
    data
}: {
    projectId: string
    folderId: string
    data: { name?: string; parentId?: string | null }
}): Promise<void> => {
    await client.patch(`${PROJECTS_API_BASE}/${projectId}${ASSETS_API_BASE}/folders/${folderId}`, data)
}

type UseUpdateFolderOptions = {
    mutationConfig?: MutationConfig<typeof updateFolder>
}

export const useUpdateFolder = ({ mutationConfig }: UseUpdateFolderOptions = {}) => {
    const queryClient = useQueryClient()

    return useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folder-contents'] })
        },
        ...mutationConfig,
        mutationFn: updateFolder
    })
}

// --- DELETE ASSET ---
export const deleteAsset = async ({ projectId, assetId }: { projectId: string; assetId: string }): Promise<void> => {
    await client.delete(`${PROJECTS_API_BASE}/${projectId}${ASSETS_API_BASE}/${assetId}`)
}

type UseDeleteAssetOptions = {
    mutationConfig?: MutationConfig<typeof deleteAsset>
}

export const useDeleteAsset = ({ mutationConfig }: UseDeleteAssetOptions = {}) => {
    const queryClient = useQueryClient()

    return useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folder-contents'] })
        },
        ...mutationConfig,
        mutationFn: deleteAsset
    })
}

// --- DELETE FOLDER ---
export const deleteFolder = async ({ projectId, folderId }: { projectId: string; folderId: string }): Promise<void> => {
    await client.delete(`${PROJECTS_API_BASE}/${projectId}${ASSETS_API_BASE}/folders/${folderId}`)
}

type UseDeleteFolderOptions = {
    mutationConfig?: MutationConfig<typeof deleteFolder>
}

export const useDeleteFolder = ({ mutationConfig }: UseDeleteFolderOptions = {}) => {
    const queryClient = useQueryClient()

    return useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folder-contents'] })
        },
        ...mutationConfig,
        mutationFn: deleteFolder
    })
}
