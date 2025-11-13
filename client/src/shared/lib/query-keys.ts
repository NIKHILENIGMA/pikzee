export const workspaceKeys = {
    all: () => ['workspaces'] as const,
    lists: () => [...workspaceKeys.all(), 'list'] as const,
    detail: (id: string) => [...workspaceKeys.all(), id] as const,
    details: () => [...workspaceKeys.all(), 'detail'] as const
}
