import { Plus, PanelLeft, Loader, FileText, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useDefaultWorkspace } from '@/features'
import { useSidebar } from '../api/get-sidebar-drafts'
import type { DraftSidebarDTO } from '../types/draft.types'
import { toast } from 'sonner'
import { useCreateDraft } from '../api/create-draft'
import { useDraftContext } from '../hooks/use-draft-context'

// import { pages } from '../constant'

export default function DraftSidebar() {
    const { documentId, pageId } = useParams<{ documentId: string; pageId: string }>()
    const [collapsed, setCollapsed] = useState(false)
    const navigate = useNavigate()
    const { data: workspaceResponse } = useDefaultWorkspace({
        queryConfig: {
            enabled: true
        }
    })
    const { updateDraft } = useDraftContext()
    const {
        data: pages,
        isLoading: isSidebarLoading,
        isError: sidebarError
    } = useSidebar({
        workspaceId: workspaceResponse?.data.id!,
        docId: documentId!
    })

    const { mutateAsync: createDraftMutation, isError: createDraftError } = useCreateDraft({
        workspaceId: workspaceResponse?.data.id!
    })

    const handleNewDraft = async () => {
        try {
            const newDraft = await createDraftMutation({ documentId: documentId!, workspaceId: workspaceResponse?.data.id! })
            toast.success('Draft created successfully')
            updateDraft(newDraft)
            navigate(`/documents/${documentId}/pages/${newDraft.id}`)
        } catch (error) {
            toast.error(`${createDraftError ? 'Failed to create draft' : 'Draft created successfully'}`)
        }
    }

    const handleDeleteDraft = () => {
        // Implement delete draft functionality here
        toast.success('Draft deleted successfully!')
    }

    useEffect(() => {
        if (pages && pageId === undefined) {
            navigate(`/documents/${documentId}/pages/${pages[0].id}`)
        }
    }, [])

    if (isSidebarLoading) {
        return <Loader className="animate-spin" />
    }

    return (
        <aside className={`border-r transition-all ${collapsed ? 'w-14' : 'w-64'}`}>
            <div className="flex items-center justify-between p-2">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setCollapsed(!collapsed)}>
                    <PanelLeft size={18} />
                </Button>

                {!collapsed && (
                    <div className="w-full flex items-center justify-between gap-2">
                        <button
                            type="button"
                            className="cursor-pointer"
                            onClick={() => navigate('/documents')}>
                            Docs
                        </button>
                        <Button
                            onClick={() => {}}
                            size="icon"
                            variant="ghost">
                            <Plus size={18} />
                        </Button>
                    </div>
                )}
            </div>

            <ScrollArea className="h-[calc(100vh-40px)]">
                <div className="space-y-1 p-2">
                    {!sidebarError && pages ? (
                        pages.map((page: DraftSidebarDTO) => (
                            <NavLink
                                key={page.id}
                                to={`/documents/${documentId}/pages/${page.id}`}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 justify-between rounded px-1 ${isActive ? 'bg-secondary/90 text-primary-foreground' : 'hover:bg-muted'}`
                                }>
                                <div className="flex items-center gap-2">
                                    <span className="text-md">{page.icon ?? <FileText className="text-foreground" />}</span>
                                    {!collapsed && (
                                        <span className="truncate italic text-foreground/70">{page.title == null ? 'Untitled' : page.title}</span>
                                    )}
                                </div>
                                {!collapsed && (
                                    <Button
                                        variant="link"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            e.preventDefault()
                                            handleDeleteDraft()
                                        }}
                                        className="p-0 text-red-500 hover:opacity-80 z-50">
                                        <Trash />
                                    </Button>
                                )}
                            </NavLink>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <p className="text-sm text-muted-foreground">No drafts found. Create your first draft!</p>
                            <Button
                                onClick={handleNewDraft}
                                size="sm">
                                New Draft
                            </Button>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </aside>
    )
}
