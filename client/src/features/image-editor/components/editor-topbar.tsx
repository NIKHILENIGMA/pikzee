import { useStore } from '@/shared/store'

export function EditorTopbar() {
    const transformations = useStore((state) => state.transformations)

    return (
        <div className="flex items-center justify-between border-b border-border/60 bg-card px-5 py-6 shadow-sm">
            <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold tracking-tight text-foreground">Image Editor</h2>
                <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {transformations.length} changes
                </span>
            </div>
        </div>
    )
}
