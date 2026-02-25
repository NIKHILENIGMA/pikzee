export const workspaceKeys = {
    all: () => ['workspaces'] as const,
    lists: () => [...workspaceKeys.all(), 'list'] as const,
    default: () => [...workspaceKeys.all(), 'default'] as const,
    detail: (id: string) => [...workspaceKeys.all(), id] as const,
    details: () => [...workspaceKeys.all(), 'detail'] as const
}

export const memberKeys = {
    all: () => [...workspaceKeys.all(), 'members'] as const,
    lists: (workspaceId: string) => [...memberKeys.all(), 'list', workspaceId] as const,
    detail: (workspaceId: string, memberId: string) => [...memberKeys.all(), 'detail', workspaceId, memberId] as const
}

export const socialAccountKeys = {
    all: (workspaceId: string) => [...workspaceKeys.all(), 'social-accounts', workspaceId] as const,
    lists: (workspaceId: string) => [...socialAccountKeys.all(workspaceId), 'list'] as const,
    detail: (workspaceId: string, accountId: string) => [...socialAccountKeys.all(workspaceId), 'detail', accountId] as const
}