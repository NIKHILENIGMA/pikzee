import { FileText } from 'lucide-react'
import type { FC } from 'react'

import type { DocumentDTO } from '../types'

import DocumentOptions from './document-options'

interface DocumentListProps {
    documents: DocumentDTO[]
    workspaceId: string
}

const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })

const DocumentList: FC<DocumentListProps> = ({ documents, workspaceId }) => {
    if (!documents.length) {
        return (
            <div className="w-full rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
                No documents found. Create your first document to get started.
            </div>
        )
    }

    return (
        <div className="w-full rounded-lg border border-border bg-card">
            {documents.map((document) => (
                <div
                    key={document.id}
                    className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                            <p className="font-medium truncate">{document.title}</p>
                            <p className="text-xs text-muted-foreground">Updated {formatDate(document.updatedAt)}</p>
                        </div>
                    </div>

                    <DocumentOptions
                        workspaceId={workspaceId}
                        documentId={document.id}
                        title={document.title}
                    />
                </div>
            ))}
        </div>
    )
}

export default DocumentList
