import { useCreateCoverImage } from '../api/create-cover'
import { useAddEmoji } from '../api/add-emoji'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
// import { useDraftContext } from './use-draft-context'
import { useDraftStore } from '../store/draft.store'

interface UseHeaderActionsProps {
    workspaceId: string
    pageId: string
    documentId: string
}

function randomEmoji() {
    const emojis = ['😀', '🚀', '🎉', '🌟', '🔥', '💡', '📚', '🎨', '🎵', '⚡']
    return emojis[Math.floor(Math.random() * emojis.length)]
}

export const useHeaderActions = ({ workspaceId, pageId, documentId }: UseHeaderActionsProps) => {
    const updateCoverImage = useDraftStore((s) => s.updateCoverImage)
    const updateEmoji = useDraftStore((s) => s.updateEmoji)
    const { mutateAsync: createCoverImage, isPending: createCoverImagePending } = useCreateCoverImage({
        workspaceId,
        draftId: pageId!
    })

    const { mutateAsync: addEmoji, isPending: addEmojiPending } = useAddEmoji({
        workspaceId
    })

    // Add cover image with random Unsplash photo
    const handleAddCoverImage = async () => {
        try {
            const coverImageUrl = await createCoverImage({
                documentId: documentId!,
                draftId: pageId!,
                workspaceId
            })

            // Update the draft context with the new cover image URL and a default config
            updateCoverImage(coverImageUrl) // Update cover image with random Unsplash photo
            
            toast.success('Cover image added successfully!')
        } catch (error) {
            const errorMessage = ((error as AxiosError).response?.data as { message: string }).message || 'Failed to add cover image.'
            toast.error(`${errorMessage}`)
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
            updateEmoji(newIcon) // Update the draft context with the new emoji icon
            toast.success('Icon added successfully!')
        } catch (error) {
            const errorMessage = ((error as AxiosError).response?.data as { message: string }).message || 'Failed to add icon.'
            toast.error(`${errorMessage}`)
        }
    }

    return {
        createCoverImagePending,
        addEmojiPending,
        handleAddCoverImage,
        handleAddEmojiIcon
    }
}
