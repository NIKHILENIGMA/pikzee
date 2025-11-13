import type { FC } from 'react'

import ContentLayout from '@/components/layout/content-layout'

const ProjectSettings: FC = () => {
    return (
        <ContentLayout>
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-4">Project Settings</h1>
                <p className="text-base text-muted-foreground">Manage your project settings here.</p>
            </div>
        </ContentLayout>
    )
}

export default ProjectSettings
