export interface DocumentDTO {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    workspaceId: string;
    title: string;
    docImgUrl: string | null;
    permission: "private" | "workspace" | "public";
    shareToken: string | null;
    isArchived: boolean;
    archivedAt: Date | null;
    createdBy: string;
}

export type DocumentVisiblity = 'private' | 'workspace' | 'public'

export type DocumentCreatedDTO = {
    id: string
    workspaceId: string
    title: string
    docImgUrl: string | null
    permission: DocumentVisiblity
    shareToken: string | null
    isArchived: boolean
    archivedAt: Date | null
    createdBy: string
    createdAt: Date
    updatedAt: Date
    initialDraftId: string
}
