import type { FC } from 'react'
import type { DraftDTO, DraftSettingType } from '../types/draft.types'
import { useDraftContext } from '../hooks/use-draft-context'

interface DraftTitleProps {
    settings: DraftSettingType
    draft: DraftDTO
}

const DraftTitle: FC<DraftTitleProps> = ({ settings, draft }) => {
    const { updateDraft } = useDraftContext()

    return (
        <div className='w-full'>
            <input
                className="w-full text-4xl font-bold outline-none bg-transparent"
                placeholder="Untitled"
                value={draft.title ?? ''}
                onChange={(e) => updateDraft({ title: e.target.value })}
                style={{ fontFamily: `var(--font-${settings.fontStyle})`, fontSize: settings.fontSize }}
            />
        </div>
    )
}

export default DraftTitle
