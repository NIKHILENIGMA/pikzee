import { AxiosError } from 'axios'
import { toast } from 'sonner'

import { useCreateCoverImage } from '../api/create-cover'
import { useUpdateEmoji } from '../api/update-emoji'
import { generateRandomEmoji } from '../util/emoji'

interface UseHeaderActionsProps {
    workspaceId: string
    pageId: string
    documentId: string
}

export const useHeaderActions = ({ workspaceId, pageId, documentId }: UseHeaderActionsProps) => {
    // Mutation hook for adding a cover image to the draft
    const { mutateAsync: createCoverImage, isPending: createCoverImagePending } = useCreateCoverImage({
        workspaceId,
        draftId: pageId!
    })

    // Mutation hook for updating the emoji icon of the draft
    const { mutateAsync: addEmoji, isPending: addEmojiPending } = useUpdateEmoji({
        workspaceId,
        documentId,
        draftId: pageId!
    })

    // Add cover image with random Unsplash photo
    const handleAddCoverImage = async () => {
        try {
            const coverImageUrl = await createCoverImage({
                documentId: documentId!,
                draftId: pageId!,
                workspaceId
            })

            console.log(coverImageUrl)

            // Update the draft context with the new cover image URL and a default config
            // updateCoverImage(coverImageUrl) // Update cover image with random Unsplash photo

            toast.success('Cover image added successfully!')
        } catch (error) {
            const errorMessage = ((error as AxiosError).response?.data as { message: string }).message || 'Failed to add cover image.'
            toast.error(`${errorMessage}`)
        }
    }

    // Add random emoji icon
    const handleAddEmojiIcon = async () => {
        const newIcon = generateRandomEmoji()

        try {
            await addEmoji({
                documentId: documentId!,
                draftId: pageId!,
                workspaceId,
                icon: newIcon
            })
        } catch (error) {
            throw error
        }
    }

    return {
        createCoverImagePending,
        addEmojiPending,
        handleAddCoverImage,
        handleAddEmojiIcon
    }
}
