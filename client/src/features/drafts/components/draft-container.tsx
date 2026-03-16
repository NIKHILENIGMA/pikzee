import type { FC, ReactNode } from 'react'

import type { DraftSettingType } from '../types/draft.types'

interface DraftContainerProps {
    settings: DraftSettingType
    children: ReactNode
}

const DraftContainer: FC<DraftContainerProps> = ({ settings, children }) => {
    return (
        <div
            style={{
                fontFamily: 'var(--font-' + settings.fontStyle + ')',
                fontSize: settings.fontSize
            }}>
            {
                children
            }
        </div>
    )
}

export default DraftContainer
