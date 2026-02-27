import { useUser } from '@clerk/clerk-react'
import { Plus } from 'lucide-react'
import type { FC } from 'react'
import { Toaster } from 'sonner'

import { Loader } from '@/components'
import { Button } from '@/components/ui/button'
import { CreateDocumentDialog, DocumentList, useDocuments, useDefaultWorkspace } from '@/features'

const DocumentPage: FC = () => {
    const { user } = useUser()

    const workspaceQuery = useDefaultWorkspace({
        queryConfig: {
            staleTime: 10 * 60 * 1000,
            gcTime: 15 * 60 * 1000
        }
    })

    const workspaceId = workspaceQuery.data?.data.id ?? ''

    const documentsQuery = useDocuments({
        workspaceId,
        queryConfig: {
            enabled: !!workspaceId
        }
    })

    const isLoading = workspaceQuery.isPending || (!!workspaceId && documentsQuery.isPending)
    const documents = documentsQuery.data?.data ?? []

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <main className="flex-1 px-8 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Documents</h1>

                    <CreateDocumentDialog
                        workspaceId={workspaceId}
                        createdBy={user?.id || ''}>
                        <Button disabled={!workspaceId || !user?.id}>
                            <Plus className="h-4 w-4" />
                            New Document
                        </Button>
                    </CreateDocumentDialog>
                </div>

                {isLoading ? (
                    <div className="fixed inset-0 flex items-center justify-center">
                        <Loader size="xl" />
                    </div>
                ) : (
                    <DocumentList
                        documents={documents}
                        workspaceId={workspaceId}
                    />
                )}

                <Toaster />
            </main>
        </div>
    )
}

export default DocumentPage
