import { useState, type FC } from 'react'
import { Outlet, useParams } from 'react-router'

import { useDrafts } from '@/features/drafts/api/get-drafts'
import { useDefaultWorkspace } from '@/features'
import DraftSidebar from '@/features/drafts/components/draft-sidebar'
import type { DraftDTO } from '@/features/drafts/types/draft.types'

const dummyDrafts: DraftDTO[] = [
    {
        id: '76873db8-aec6-4e09-8530-65281aa64d20',
        docId: '65191af0-5c3a-4d46-a71e-5abc50e24aa4',
        title: 'some random title which is so long that it will not fit inside the title',
        content: '',
        icon: null,
        coverImageUrl: null,
        coverImageConfig: null,
        settings: {
            fontSize: '16px',
            showIcon: true,
            fontStyle: 'inter',
            showCover: true,
            showOwner: true,
            isFullWidth: false,
            showLastModified: true
        },
        ownerId: 'user_39qemULXS34po9Ny8RMaIPkkgIy',
        lastUpdatedBy: 'user_39qemULXS34po9Ny8RMaIPkkgIy',
        createdAt: new Date('2026-03-05T20:19:57.282Z'),
        updatedAt: new Date('2026-03-05T20:19:57.282Z')
    },
    {
        id: '68873db8-aec6-4e09-8530-65281aa64d20',
        docId: '65191af0-5c3a-4d46-a71e-5abc50e24aa4',
        title: null,
        content: '',
        icon: null,
        coverImageUrl: null,
        coverImageConfig: null,
        settings: {
            fontSize: '16px',
            showIcon: true,
            fontStyle: 'inter',
            showCover: true,
            showOwner: true,
            isFullWidth: false,
            showLastModified: true
        },
        ownerId: 'user_39qemULXS34po9Ny8RMaIPkkgIy',
        lastUpdatedBy: 'user_39qemULXS34po9Ny8RMaIPkkgIy',
        createdAt: new Date('2026-03-05T20:19:57.282Z'),
        updatedAt: new Date('2026-03-05T20:19:57.282Z')
    }
]

const Draft: FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
    const { data: workspaceResponse } = useDefaultWorkspace({
        queryConfig: {
            enabled: true
        }
    })
    const { documentId, draftId } = useParams<{
        documentId: string
        draftId: string
    }>()
    const { data: draftResponse, isLoading } = useDrafts({
        workspaceId: workspaceResponse?.data.id!,
        docId: documentId || '',
        queryConfig: {
            enabled: !!documentId && !!draftId
        }
    })

    console.log(draftResponse)

    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* Left Sidebar */}
            <DraftSidebar
                isSidebarOpen={sidebarOpen}
                onSidebarToggle={setSidebarOpen}
                drafts={dummyDrafts}
                isDraftsLoading={isLoading}
            />

            {/* Main Content Area */}
            <Outlet />
        </div>
    )
}

export default Draft
