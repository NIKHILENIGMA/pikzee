import { Button } from '@/components/ui/button'
import { Image, Settings, SmilePlus } from 'lucide-react'
import type { DraftDTO, DraftSettingType } from '../types/draft.types'
import { toast } from 'sonner'

interface DraftHeaderActionsProps {
    draft: DraftDTO
    settings: DraftSettingType
    onUpdateDraft: (payload: any) => void
    onOpenSettings: () => void
}

function randomEmoji() {
    const emojis = ['😀', '🚀', '🎉', '🌟', '🔥', '💡', '📚', '🎨', '🎵', '⚡']
    return emojis[Math.floor(Math.random() * emojis.length)]
}

export function DraftHeaderActions({ draft, settings, onUpdateDraft, onOpenSettings }: DraftHeaderActionsProps) {
    const handleAddCoverImage = () => {
        // await
        onUpdateDraft({ coverImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' })
        toast.success('Cover image added successfully!')
    }

    const handleAddEmojiIcon = () => {
        onUpdateDraft({ icon: randomEmoji() })
        toast.success('Icon added successfully!')
    }

    return (
        <div className="flex gap-2 mt-5 mb-3 py-4 ">
            {settings.showIcon && !draft.icon && (
                <Button
                    variant="ghost"
                    size="default"
                    onClick={handleAddEmojiIcon}>
                    <SmilePlus
                        size={'25'}
                        className="mr-2"
                    />{' '}
                    Add Icon
                </Button>
            )}

            {settings.showCover && !draft.coverImageUrl && (
                <Button
                    variant="ghost"
                    size="default"
                    onClick={handleAddCoverImage}>
                    <Image className="h-4 w-4 mr-2" /> Add Cover
                </Button>
            )}

            <Button
                variant="ghost"
                size="default"
                onClick={onOpenSettings}>
                <Settings className="h-4 w-4 mr-2" /> Settings
            </Button>
        </div>
    )
}
