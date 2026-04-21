import { useEffect, useRef, useState, type ChangeEvent, type FC } from 'react'
import type { DraftSettingType } from '../types/draft.types'
import { useStore } from '@/shared/store'
import { useAutoSave } from '../hooks/use-auto-save'
import { useWorkspaceContext } from '@/features/workspace'
import { useParams } from 'react-router'

interface DraftTitleProps {
    initialTitle: string | null
    settings: DraftSettingType
}

const DraftTitle: FC<DraftTitleProps> = ({ initialTitle, settings }) => {
    const { documentId, pageId } = useParams<{ documentId: string; pageId: string }>()
    const { id: workspaceId } = useWorkspaceContext()
    const [localTitle, setLocalTitle] = useState<string | null>(initialTitle)
    const optimisticMeta = useStore((state) => state.optimisticMeta)
    const optimisticTitleChange = useStore((state) => state.setOptimisticMeta)
    const ref = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setLocalTitle(initialTitle)

    }, [initialTitle, documentId, pageId])

    const { debouncedSave } = useAutoSave(
        workspaceId,
        documentId ?? '',
        pageId ?? '',
        1800 // 1.8 seconds debounce for title changes to reduce excessive saves while typing
    )

    // Handle title change with optimistic UI update
    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newTitle: string = e.target.value

        // Call the onChange prop to update the title in the parent component
        setLocalTitle(newTitle)

        // Update optimistic meta in the store to reflect the title change immediately in the UI
        optimisticTitleChange({
            title: newTitle,
            icon: optimisticMeta?.icon || null
        })

        // Trigger the debounced save function to persist the title change after a delay
        debouncedSave({ title: newTitle })
    }

    return (
        <div className="w-full px-5">
            <input
                ref={ref}
                className="w-full font-bold outline-none bg-transparent"
                placeholder="Untitled"
                value={localTitle ?? ''}
                onChange={handleTitleChange}
                style={{ fontFamily: `var(--font-${settings.fontStyle})`, fontSize: settings.fontSize }}
            />
        </div>
    )
}

export default DraftTitle
