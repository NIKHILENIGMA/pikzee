import { type FC, type ReactNode } from 'react'

import { Toaster } from '../ui/sonner'

const ContentLayout: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="w-full min-h-screen bg-background text-foreground px-10 py-4 mx-auto">
            {children}
            <Toaster />
        </div>
    )
}

export default ContentLayout
