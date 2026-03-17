import { Image, Loader, Settings, SmilePlus } from 'lucide-react'
import { useParams } from 'react-router'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import type { DraftDTO, DraftSettingType } from '../types/draft.types'
import { useWorkspaceContext } from '@/features'
import { useCreateCoverImage } from '../api/create-cover'
import { useAddEmoji } from '../api/add-emoji'
import { AxiosError } from 'axios'

interface DraftHeaderActionsProps {
    draft: DraftDTO
    settings: DraftSettingType
    onOpenSettings: () => void
    isDraftUpdating: boolean
    showError: (msg: string) => void
}

function randomEmoji() {
    const emojis = ['😀', '🚀', '🎉', '🌟', '🔥', '💡', '📚', '🎨', '🎵', '⚡']
    return emojis[Math.floor(Math.random() * emojis.length)]
}

export function DraftHeaderActions({ draft, settings, onOpenSettings, showError, isDraftUpdating }: DraftHeaderActionsProps) {
    const { id: workspaceId } = useWorkspaceContext()
    const { pageId, documentId } = useParams<{ pageId: string; documentId: string }>()

    const {
        mutateAsync: createCoverImage,
        isPending: createCoverImagePending,
        isError: createCoverImageError
    } = useCreateCoverImage({
        workspaceId,
        draftId: pageId!
    })

    const {
        mutateAsync: addEmoji,
        isPending: addEmojiPending,
        isError: addEmojiError
    } = useAddEmoji({
        workspaceId,
        draftId: pageId!
    })

    // Add cover image with random Unsplash photo
    const handleAddCoverImage = async () => {
        try {
            await createCoverImage({
                documentId: documentId!,
                draftId: pageId!,
                workspaceId
            })
            toast.success('Cover image added successfully!')
        } catch (error) {
            toast.error(`${createCoverImageError ? (error as Error).message : 'Failed to add cover image.'}`)
        }
    }

    // Add random emoji icon
    const handleAddEmojiIcon = async () => {
        const newIcon = randomEmoji()
        try {
            await addEmoji({
                documentId: documentId!,
                draftId: pageId!,
                workspaceId,
                icon: newIcon
            })
            toast.success('Icon added successfully!')
        } catch (error) {
            // console.log();
            showError(((error as AxiosError).response?.data as { message: string }).message)
            toast.error(`${addEmojiError ? (error as Error).message : 'Failed to add icon.'}`)
        }
    }

    return (
        <div className="flex gap-2 mt-5 mb-3 py-4">
            {settings.showIcon && !draft.icon && (
                <Button
                    variant="ghost"
                    size="default"
                    onClick={handleAddEmojiIcon}
                    disabled={isDraftUpdating}>
                    {' '}
                    {addEmojiPending ? (
                        <>
                            <Loader className="animate-spin" />
                            Adding Icon...
                        </>
                    ) : (
                        <>
                            <SmilePlus
                                size={'25'}
                                className="mr-2"
                            />
                            Add Icon
                        </>
                    )}
                </Button>
            )}

            {settings.showCover && !draft.coverImageUrl && (
                <Button
                    variant="ghost"
                    size="default"
                    onClick={handleAddCoverImage}>
                    {createCoverImagePending ? (
                        <>
                            <Loader className="animate-spin" />
                            Adding Cover...
                        </>
                    ) : (
                        <>
                            <Image
                                size={'25'}
                                className="mr-2"
                            />
                            Add Cover
                        </>
                    )}
                </Button>
            )}

            <Button
                variant="ghost"
                size="default"
                onClick={onOpenSettings}>
                <Settings className="h-4 w-4 mr-2" /> Settings
            </Button>

            {isDraftUpdating && (
                <div className="flex items-center gap-2 text-sm text-green-500">
                    <Loader className="animate-spin" />
                    Saving...
                </div>
            )}
        </div>
    )
}
