import { useEffect, useRef } from 'react'

import { useUpdateDraftContent } from '../api/update-content'
import { useDraftStore } from '../store/draft.store'

export const useAutoSave = ({ workspaceId, documentId, draftId }: { workspaceId: string; documentId: string; draftId: string }) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const lastProcessedId = useRef<string>(draftId)

    const draft = useDraftStore((s) => s.draft)
    const lastSavedDraft = useDraftStore((s) => s.lastSavedDraft)
    const setLastSavedDraft = useDraftStore((s) => s.setLastSavedDraft)
    const isHydrating = useDraftStore((s) => s.isHydrating)
    const handleEditingState = useDraftStore((s) => s.handleEditingState)

    // Get the mutation function to update draft content
    const { mutate: updateDraftContent } = useUpdateDraftContent({})

    useEffect(() => {
        if (isHydrating || !draft.id || draft.id !== draftId) return
        const isTitleDirty = draft.title !== lastSavedDraft.title
        const isContentDirty = JSON.stringify(draft.content) !== JSON.stringify(lastSavedDraft.content)

        if (!isTitleDirty && !isContentDirty) return

        if (lastProcessedId.current !== draftId) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            lastProcessedId.current = draftId
            return // Stop here; wait for next cycle where references match
        }

        handleEditingState('idle')

        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        timeoutRef.current = setTimeout(() => {
            handleEditingState('saving')

            updateDraftContent(
                {
                    workspaceId,
                    docId: documentId,
                    draftId,
                    title: draft.title || undefined,
                    content: draft.content || ''
                },
                {
                    onSuccess: () => {
                        if (lastProcessedId.current !== draftId) return
                        setLastSavedDraft(draft)
                        handleEditingState('saved')
                    },
                    onError: () => {
                        if (lastProcessedId.current !== draftId) return
                        handleEditingState('error')
                    }
                }
            )
        }, 1000)

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [draft.title, draft.content, draft.id, draftId, isHydrating])
}
