import { useRef, type FC } from 'react'
import type { DraftSettingType } from '../types/draft.types'

interface DraftTitleProps {
    settings: DraftSettingType
    title: string
    onTitleChange: (title: string) => void
}

const DraftTitle: FC<DraftTitleProps> = ({ settings, title, onTitleChange }) => {
    const ref = useRef<HTMLInputElement>(null)

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            ref.current?.blur()
        }
    }

    return (
        <div className="w-full">
            <input
                ref={ref}
                className="w-full text-4xl font-bold outline-none bg-transparent"
                placeholder="Untitled"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ fontFamily: `var(--font-${settings.fontStyle})`, fontSize: settings.fontSize }}
            />
        </div>
    )
}

export default DraftTitle
