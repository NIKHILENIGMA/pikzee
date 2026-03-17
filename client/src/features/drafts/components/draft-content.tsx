import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router'

import { cn } from '@/shared/lib/utils'
import { EditorRoot } from '@/features/block/components/editor-root'
import { useWorkspaceContext } from '@/features/workspace'

import { useDraftContext } from '../hooks/use-draft-context'
import { useGetDraft } from '../api/get-draft'

import DraftContainer from './draft-container'
import { DraftCover } from './draft-cover'
import { DraftHeaderActions } from './draft-header-actions'
import DraftMeta from './draft-meta'
import DraftTitle from './draft-title'
import type { DraftSettingType } from '../types/draft.types'
import { DraftSettings } from './draft-settings'
import { X } from 'lucide-react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useUpdateDraftContent } from '../api/update-content'
// import { mockDrafts } from '../constant'

const DEFAULT_SETTINGS: DraftSettingType = {
    fontStyle: 'sans',
    fontSize: '25px',
    isFullWidth: false,
    showCover: true,
    showIcon: true,
    showOwner: true,
    showLastModified: true
}

export default function DraftContent() {
    const { id: workspaceId } = useWorkspaceContext()
    const { draft, updateDraft } = useDraftContext()
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false)
    const { pageId, documentId } = useParams<{ documentId: string; pageId: string }>()
    const [error, setError] = useState<string | null>(null)
    const [editorContent, setEditorContent] = useState<{
        title: string
        content: string
    }>({
        title: '',
        content: ''
    })
    // Debounce title and content to avoid excessive API calls while typing
    const debouncedTitle = useDebounce({
        value: editorContent.title,
        delay: 1000
    })

    const debouncedContent = useDebounce({
        value: editorContent.content,
        delay: 1500
    })

    const { data: draftData, isLoading: draftLoading } = useGetDraft({
        workspaceId,
        docId: documentId!,
        draftId: pageId!
    })

    const { mutateAsync: updateDraftContent, isPending: isUpdatingDraftContent } = useUpdateDraftContent({
        workspaceId,
        draftId: pageId!
    })

    const handleClearErrorMsg = () => {
        setError(null)
    }

    useEffect(() => {
        if (draftData && !draftLoading) {
            const hasIdChanged = draft.id !== draftData.id
            const hasIconChanged = draft.icon !== draftData.icon
            const hasCoverChanged = draft.coverImageUrl !== draftData.coverImageUrl
            const hasSettingsChanged = JSON.stringify(draft.settings) !== JSON.stringify(draftData.settings)
            const hasCoverConfigChanged = JSON.stringify(draft.coverImageConfig) !== JSON.stringify(draftData.coverImageConfig)
            if (hasIdChanged) {
                updateDraft(draftData)
            } else if (hasIconChanged || hasCoverChanged || hasSettingsChanged || hasCoverConfigChanged) {
                updateDraft({
                    icon: draftData.icon,
                    coverImageUrl: draftData.coverImageUrl,
                    coverImageConfig: draftData.coverImageConfig,
                    settings: draftData.settings
                })
            }
        }
    }, [draft.id, draft.icon, draft.coverImageUrl, draft.settings, draftData, draftLoading, updateDraft])

    useEffect(() => {
        if (debouncedTitle && debouncedContent) {
            updateDraftContent({
                workspaceId,
                docId: documentId!,
                draftId: pageId!,
                title: debouncedTitle,
                content: debouncedContent
            })
        }
    }, [debouncedTitle, debouncedContent, workspaceId, documentId, pageId])

    // Merge default settings with draft settings
    const settings = useMemo(() => ({ ...DEFAULT_SETTINGS, ...(draft.settings || {}) }), [draft.settings])

    if (draftLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Loading draft content...</p>
            </div>
        )
    }

    return (
        <DraftContainer settings={settings}>
            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex items-center justify-between">
                    <p className="text-sm">{error}</p> <X onClick={handleClearErrorMsg} />
                </div>
            )}
            {/* Cover + Icon overlay */}
            <DraftCover
                draft={draft}
                settings={settings}
            />

            <div
                className={cn(
                    'transition-[max-width,padding-left,padding-right] ease-in-out',
                    !!settings.isFullWidth ? 'px-8 max-w-full' : 'max-w-4xl mx-auto px-4',
                    settings.showIcon && draft.icon && 'pt-12'
                )}
                style={{
                    transition: 'max-width 0.3s ease, padding-left 0.3s ease, padding-right 0.3s ease'
                }}>
                {/* Controls */}
                <DraftHeaderActions
                    draft={draft}
                    settings={settings}
                    onOpenSettings={() => setSettingsOpen(true)}
                    showError={(msg) => setError(msg)}
                    isDraftUpdating={isUpdatingDraftContent}
                />

                {/* Owner Details */}
                <DraftMeta
                    draft={draft}
                    settings={settings}
                />

                {/* Title */}
                <DraftTitle
                    title={editorContent.title}
                    onTitleChange={(title) => setEditorContent((prev) => ({ ...prev, title }))}
                    settings={settings}
                />

                {/* Editor */}
                <EditorRoot
                    content={editorContent.content}
                    onContentChange={(content) => setEditorContent((prev) => ({ ...prev, content }))}
                />

                {/* Settings Panel */}
                <DraftSettings
                    isOpen={settingsOpen}
                    onClose={() => setSettingsOpen(false)}
                    settings={settings}
                />
            </div>
        </DraftContainer>
    )
}
