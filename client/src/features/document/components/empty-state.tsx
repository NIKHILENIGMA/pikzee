import { Button } from '@/components/ui/button'
import { FileText, Plus, Sparkles } from 'lucide-react'
import CreateDocumentDialog from './create-document-dialog'

interface EmptyStateProps {
    workspaceId: string
}

export default function EmptyState({ workspaceId }: EmptyStateProps) {
    return (
        <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-muted/20 py-16 px-4">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-4">
                <FileText className="h-10 w-10 text-accent" />
            </div>

            <h3 className="text-2xl font-bold text-foreground text-center mt-4">No documents yet</h3>

            <p className="mt-2 text-center text-muted-foreground max-w-md">
                You haven't created any documents yet. Start creating your first document to get organized and collaborate with your team.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <CreateDocumentDialog workspaceId={workspaceId}>
                    <Button
                        size={'default'}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2">
                        <Plus className="h-5 w-5" />
                        <span>Create New Document</span>
                    </Button>
                </CreateDocumentDialog>
                <Button
                    size={'default'}
                    variant="outline"
                    className="inline-flex items-center justify-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Learn More
                </Button>
            </div>
        </div>
    )
}
