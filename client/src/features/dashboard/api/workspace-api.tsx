import { WORKSPACE_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'

import type { CreateWorkspaceInput } from '../types'
import type { Workspace } from '../types'

// ------------------------------------- Mutation Operations -------------------------------------
export const createWorkspaceApi = async (data: CreateWorkspaceInput) => {
    const response = await client.post<Workspace, CreateWorkspaceInput>(WORKSPACE_API_BASE, data)

    return response.data
}

export const updateWorkspaceApi = async (workspaceId: string, data: Partial<CreateWorkspaceInput>) => {
    const response = await client.patch<Workspace, Partial<CreateWorkspaceInput>>(`${WORKSPACE_API_BASE}/${workspaceId}`, data)

    return response.data
}

export const deleteWorkspaceApi = async (workspaceId: string) => {
    const response = await client.delete<{ success: boolean }>(`${WORKSPACE_API_BASE}/${workspaceId}`)

    return response.data
}

// ------------------------------------- Query Operations -------------------------------------
export const listWorkspacesApi = async (): Promise<Workspace[]> => {
    const response = await client.get<Workspace[]>(WORKSPACE_API_BASE)

    return response.data
}

export const getWorkspaceByIdApi = async (workspaceId: string): Promise<Workspace | undefined> => {
    const response = await client.get<Workspace>(`${WORKSPACE_API_BASE}/${workspaceId}`)

    return response.data
}

export const getCurrentUserWorkspaceApi = async (): Promise<Workspace[]> => {
    const response = await client.get<Workspace[]>(`${WORKSPACE_API_BASE}/me`)

    return response.data
}
