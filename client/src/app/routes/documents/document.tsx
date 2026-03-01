import { FileText, Plus } from 'lucide-react'
import { useState, useMemo } from 'react'

import { Button } from '@/components/ui/button'
import EmptyState from '@/features/document/components/empty-state'
import { CreateDocumentDialog, useDefaultWorkspace, useDocuments } from '@/features'
import DocumentCard from '@/features/document/components/document-card'
import DocumentFilters from '@/features/document/components/document-filters'

export default function DocumentsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<'recent' | 'alphabetical' | 'oldest'>('recent')

    const { data: workspaceResponse } = useDefaultWorkspace({
        queryConfig: {
            enabled: true
        }
    })
    const workspaceId = workspaceResponse?.data.id

    const { data: documents, isPending } = useDocuments({
        workspaceId: workspaceId!,
        queryConfig: {
            enabled: !!workspaceId
        }
    })

    // Filter and sort documents
    const filteredDocuments = useMemo(() => {
        let results = documents || []
        results = results.filter(
            (doc) => doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || doc.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
        )

        return results
    }, [documents, searchQuery, sortBy])

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between my-2.5">
                        <div className="flex flex-col items-start">
                            <div className="flex items-center justify-center">
                                <FileText className="h-7 w-7 text-foreground" />
                                <h1 className="text-3xl font-bold text-foreground">Documents</h1>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">Manage and organize your workspace documents</p>
                        </div>

                        {workspaceId && (
                            <CreateDocumentDialog workspaceId={workspaceId}>
                                <Button size={'lg'}>
                                    <Plus className="h-5 w-5" />
                                    New Document
                                </Button>
                            </CreateDocumentDialog>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <DocumentFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />

                {/* Grid or Empty State */}
                {isPending ? (
                    <div className="py-16 text-center">
                        <p className="text-muted-foreground">Loading documents...</p>
                    </div>
                ) : filteredDocuments.length === 0 && searchQuery === '' ? (
                    <EmptyState workspaceId={workspaceId!} />
                ) : filteredDocuments.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-muted-foreground">No documents found matching "{searchQuery}"</p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-4 text-primary hover:underline">
                            Clear search
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
                        {filteredDocuments.map((doc) => (
                            <DocumentCard
                                key={doc.id}
                                document={doc}
                                workspaceId={workspaceId!}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
