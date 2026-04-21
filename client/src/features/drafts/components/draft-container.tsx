import type { FC, ReactNode } from 'react'

interface DraftContainerProps {
    children: ReactNode
}

const DraftContainer: FC<DraftContainerProps> = ({ children }) => {
    return (
        <div>{children}</div>
    )
}

export default DraftContainer
