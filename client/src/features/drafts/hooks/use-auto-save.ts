import { useDebouncedCallback } from 'use-debounce'

import { useStore } from '@/shared/store'

import { useUpdateDraftContent } from '../api/update-content'


export const useAutoSave = (workspaceId: string, documentId: string, draftId: string, debounceMs: number = 1500) => {
    const setSyncStatus = useStore((state) => state.setSyncStatus)

    const { mutate } = useUpdateDraftContent({})

    const debouncedSave = useDebouncedCallback(
        (data: { title?: string; content?: any }) => {
            setSyncStatus('saving')
            mutate(
                { workspaceId, docId: documentId, draftId, ...data },
                {
                    onSuccess: () => {
                        setSyncStatus('saved')
                        setTimeout(() => setSyncStatus('idle'), 2000) // Reset to idle after showing "Saved" status for 2 seconds
                    },
                    onError: () => {
                        setSyncStatus('error')
                        setTimeout(() => setSyncStatus('idle'), 2000) // Reset to idle after showing "Error" status for 2 seconds
                    }
                }
            )
        },
        debounceMs,
        {
            leading: false,
            trailing: true
        }
    )

    return { debouncedSave }
}
