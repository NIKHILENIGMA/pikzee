import { useRef, useState, type ChangeEvent, type FC } from 'react'
import type { DraftSettingType } from '../types/draft.types'
import { useStore } from '@/shared/store'

interface DraftTitleProps {
    settings: DraftSettingType
}

const DraftTitle: FC<DraftTitleProps> = ({ settings }) => {
    const [localTitle, setLocalTitle] = useState<string>('')
    const optimisticMeta = useStore((state) => state.optimisticMeta)
    const optimisticTitleChange = useStore((state) => state.setOptimisticMeta)
    const ref = useRef<HTMLInputElement>(null)

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
    }

    return (
        <div className="w-full">
            <input
                ref={ref}
                className="w-full text-4xl font-bold outline-none bg-transparent"
                placeholder="Untitled"
                value={localTitle}
                onChange={handleTitleChange}
                style={{ fontFamily: `var(--font-${settings.fontStyle})`, fontSize: settings.fontSize }}
            />
        </div>
    )
}

export default DraftTitle
