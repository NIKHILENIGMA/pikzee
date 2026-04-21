import { useParams } from 'react-router'

import AssetContent from '@/features/assets/components/asset-content'

export default function AssetManagement() {
    const { projectId } = useParams<{ projectId: string }>()

    if (!projectId) {
        return (
            <div className="w-full  h-screen flex items-center justify-center">
                <p className="text-foreground/90">Project ID is missing in the URL.</p>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-background text-foreground">
            <AssetContent
                projectId={projectId}
            />
        </div>
    )
}
