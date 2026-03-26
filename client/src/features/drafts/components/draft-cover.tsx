import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useParams } from 'react-router'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme/theme-provider'
import { useWorkspaceContext } from '@/features/workspace'
import { cn } from '@/shared/lib/utils'

import type { DraftDTO, DraftSettingType } from '../types/draft.types'

import ChangeCoverImage from './change-cover-image'
import { useRemoveCoverImage } from '../api/delete-cover'
import { useAddEmoji } from '../api/add-emoji'
import { useDeleteEmoji } from '../api/delete-emoji'
import { useUpdateCoverImagePosition } from '../api/update-position'


interface DraftCoverProps {
    draft: DraftDTO
    settings: DraftSettingType
    isIconLoading?: boolean
}

export function DraftCover({ draft, settings, isIconLoading }: DraftCoverProps) {
    const [coverOptions, setCoverOptions] = useState<boolean>(false)
    const [iconPickerOpen, setIconPickerOpen] = useState<boolean>(false)
    const [repositioning, setRepositioning] = useState<'dragging' | 'show'>('show')
    const [tempPositionY, setTempPositionY] = useState<number>(draft.coverImageConfig?.positionY ?? 50)
    const [isDragging, setIsDragging] = useState(false)
    const dragStartY = useRef<number>(0)
    const dragStartPositionY = useRef<number>(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const { id: workspaceId } = useWorkspaceContext()
    const { documentId, pageId } = useParams<{ documentId: string; pageId: string }>()

    const { mutateAsync: removeCoverImage } = useRemoveCoverImage({
        workspaceId: workspaceId,
        draftId: pageId!
    })
    const { mutateAsync: addEmoji } = useAddEmoji({
        workspaceId
    })
    const { mutateAsync: deleteEmoji } = useDeleteEmoji({
        workspaceId: workspaceId,
        draftId: pageId!
    })

    const { mutateAsync: updateCoverImagePosition } = useUpdateCoverImagePosition({
        workspaceId: workspaceId,
        draftId: pageId!
    })

    const { theme } = useTheme()

    const hasCover = settings.showCover && !!draft.coverImageUrl

    // Sync tempPositionY with draft when not dragging
    useEffect(() => {
        if (repositioning === 'show') {
            setTempPositionY(draft.coverImageConfig?.positionY ?? 50)
        }
    }, [draft.coverImageConfig?.positionY, repositioning])

    // Handle removing cover image
    const handleRemoveCover = async () => {
        try {
            await removeCoverImage({
                workspaceId,
                documentId: documentId!,
                draftId: pageId!
            })

            toast.success('Cover image removed successfully!')
        } catch (error) {
            toast.error('Failed to remove cover image.')
        }
    }

    // Handle clicking the icon to open emoji picker
    const handleIconClick = () => {
        setIconPickerOpen((prev) => !prev)
    }

    // Handle removing icon
    const handleRemoveIcon = async () => {
        try {
            await deleteEmoji({
                workspaceId,
                documentId: documentId!,
                pageId: pageId!
            })
            setIconPickerOpen(false)
            toast.success('Icon removed successfully!')
        } catch (error) {
            toast.error('Failed to remove icon.')
        }
    }

    // Handle selecting an emoji from the picker
    const handleEmojiSelect = async (icon: string | null) => {
        if (!icon) return
        const newIcon = draft.icon === icon ? null : icon
        try {
            if (newIcon === null) {
                setIconPickerOpen(false)
                return
            } else {
                await addEmoji({
                    documentId: documentId!,
                    workspaceId,
                    draftId: pageId!,
                    icon: newIcon
                })
                toast.success('Icon updated successfully!')
                setIconPickerOpen(false)
            }
        } catch (error) {
            toast.error('Failed to update icon.')
        }
    }

    // Handle mouse down on cover image to start repositioning
    const handleMouseDown = (e: React.MouseEvent) => {
        if (repositioning !== 'dragging') return
        e.preventDefault()
        setIsDragging(true)
        dragStartY.current = e.clientY
        dragStartPositionY.current = tempPositionY
    }

    // Handle mouse move to update cover position
    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging || !containerRef.current) return

            const deltaY = e.clientY - dragStartY.current
            const containerHeight = containerRef.current.offsetHeight

            // SUGGESTION: Double-check direction matches your UX
            const movementPercentage = (deltaY / containerHeight) * 100
            const newPositionY = Math.min(100, Math.max(0, dragStartPositionY.current - movementPercentage))

            setTempPositionY(newPositionY)
        },
        [isDragging]
    )

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        } else {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, handleMouseMove, handleMouseUp])

    // SUGGESTION: Await updateDraft and rollback on error
    const handleRepositionCover = async () => {
        try {
            await updateCoverImagePosition({
                workspaceId,
                documentId: documentId!,
                draftId: pageId!,
                positionY: tempPositionY
            })
            setRepositioning('show')
            toast.success('Cover position updated successfully!')
        } catch (error) {
            toast.error('Failed to update cover position.')
        }
    }

    return (
        <div
            ref={containerRef}
            onMouseEnter={() => hasCover && setCoverOptions(true)}
            onMouseLeave={() => setCoverOptions(false)}
            className={cn('relative w-full transition-all duration-300 group', hasCover ? 'h-60' : 'h-0 min-h-[50px]')}>
            {hasCover && draft.coverImageUrl && (
                <img
                    src={draft.coverImageUrl!}
                    alt="Draft Cover"
                    onMouseDown={handleMouseDown}
                    className={cn(
                        'h-full w-full object-cover rounded-sm select-none',
                        repositioning === 'dragging' && (isDragging ? 'cursor-grabbing' : 'cursor-grab'),
                        repositioning === 'dragging' && 'opacity-75'
                    )}
                    style={{
                        objectPosition: `50% ${tempPositionY}%`
                    }}
                />
            )}

            {/* Cover Options Overlay */}
            {hasCover && coverOptions && repositioning !== 'dragging' && (
                <div className="absolute bottom-10 right-5 flex items-center justify-center gap-4 transition-opacity duration-300 z-20">
                    <Button
                        size={'sm'}
                        variant="outline"
                        onClick={() => setRepositioning('dragging')}
                        aria-label="Reposition cover image">
                        Reposition
                    </Button>
                    <ChangeCoverImage onRemoveCover={handleRemoveCover}>
                        <Button
                            size="sm"
                            variant="outline"
                            aria-label="Change cover image">
                            Change Cover
                        </Button>
                    </ChangeCoverImage>
                </div>
            )}

            {repositioning === 'dragging' && (
                <div className="absolute bottom-10 flex items-center justify-end gap-2 transition-opacity duration-300 p-2 w-full z-20">
                    <Button
                        variant={'outline'}
                        size={'sm'}
                        onClick={handleRepositionCover}
                        aria-label="Save cover position">
                        Save Position
                    </Button>
                    <Button
                        variant={'outline'}
                        size={'sm'}
                        onClick={() => {
                            setRepositioning('show')
                            setTempPositionY(draft.coverImageConfig?.positionY ?? 50)
                        }}
                        aria-label="Cancel cover reposition">
                        Cancel
                    </Button>
                </div>
            )}

            <div className={cn('absolute left-0 w-full translate-y-1/2 bottom-0 z-10', !hasCover && 'static translate-y-0 pt-12')}>
                <div className={cn('mx-auto px-4 w-full group/icon', !!settings.isFullWidth ? 'px-8 max-w-none' : 'max-w-4xl')}>
                    {settings.showIcon && draft.icon && (
                        <div className="relative inline-flex items-center justify-center text-7xl select-none">
                            <button
                                className="hover:scale-105 transition-transform active:scale-95"
                                onClick={handleIconClick}
                                aria-label="Change draft icon"
                                disabled={isIconLoading}>
                                {draft.icon}
                            </button>
                            {iconPickerOpen && (
                                <div className="flex absolute z-50 left-5 top-16 mt-2 ">
                                    <Picker
                                        data={data}
                                        onEmojiSelect={(emoji: { native: string }) => handleEmojiSelect(emoji.native)}
                                        theme={theme === 'dark' ? 'dark' : 'light'}
                                        set="native"
                                        previewPosition="none"
                                        skinTonePosition="search"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveIcon}
                                        className="cursor-pointer text-sm absolute right-1.5 -top-8 z-[9999] p-2"
                                        aria-label="Remove icon">
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
