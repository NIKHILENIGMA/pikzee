import { useRef, type FC } from 'react'
import type { DraftSettingType } from '../types/draft.types'

interface DraftTitleProps {
    value: string
    onChange: (value: string) => void
    settings: DraftSettingType
}

const DraftTitle: FC<DraftTitleProps> = ({ settings, value, onChange }) => {
    // const draft = useDraftStore((s) => s.draft)
    // const updateDraft = useDraftStore((s) => s.updateDraft)
    const ref = useRef<HTMLInputElement>(null)

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value
        onChange(newTitle)
    }

    return (
        <div className="w-full">
            <input
                ref={ref}
                className="w-full text-4xl font-bold outline-none bg-transparent"
                placeholder="Untitled"
                value={value}
                onChange={handleTitleChange}
                style={{ fontFamily: `var(--font-${settings.fontStyle})`, fontSize: settings.fontSize }}
            />
        </div>
    )
}

export default DraftTitle
