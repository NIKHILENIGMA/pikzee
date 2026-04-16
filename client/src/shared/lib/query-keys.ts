// core key helper (optional but clean)
export const createKeys = <T extends string>(scope: T) => ({
  all: () => [scope] as const,
})

// --------------------------------------------
// WORKSPACES
// --------------------------------------------
export const workspaceKeys = {
  all: () => ['workspaces'] as const,

  list: () => [...workspaceKeys.all(), 'list'] as const,

  detail: (workspaceId: string) =>
    [...workspaceKeys.all(), 'detail', workspaceId] as const,
}

// --------------------------------------------
// MEMBERS (workspace scoped)
// --------------------------------------------
export const memberKeys = {
  all: () => ['workspaces', 'members'] as const,

  list: (workspaceId: string) =>
    [...memberKeys.all(), workspaceId] as const,

  detail: (workspaceId: string, memberId: string) =>
    [...memberKeys.all(), 'detail', workspaceId, memberId] as const,
}

// --------------------------------------------
// DOCUMENTS (workspace scoped)
// --------------------------------------------
export const documentKeys = {
  all: () => ['workspaces', 'documents'] as const,

  list: (workspaceId: string) =>
    [...documentKeys.all(), workspaceId] as const,

  detail: (workspaceId: string, documentId: string) =>
    [...documentKeys.all(), 'detail', workspaceId, documentId] as const,
}

// --------------------------------------------
// DRAFTS (workspace + document scoped)
// --------------------------------------------
export const draftKeys = {
  all: () => ['workspaces', 'drafts'] as const,

  list: (workspaceId: string, documentId: string) =>
    [...draftKeys.all(), workspaceId, documentId] as const,

  detail: (
    workspaceId: string,
    documentId: string,
    draftId: string
  ) =>
    [
      ...draftKeys.all(),
      'detail',
      workspaceId,
      documentId,
      draftId,
    ] as const,
}

// --------------------------------------------
// SOCIAL ACCOUNTS (workspace scoped)
// --------------------------------------------
export const socialAccountKeys = {
  all: () => ['workspaces', 'social-accounts'] as const,

  list: (workspaceId: string) =>
    [...socialAccountKeys.all(), workspaceId] as const,

  detail: (workspaceId: string, accountId: string) =>
    [
      ...socialAccountKeys.all(),
      'detail',
      workspaceId,
      accountId,
    ] as const,
}