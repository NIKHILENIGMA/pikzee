import { type FC, type ReactNode } from 'react'

import { WorkspaceContext } from '../hooks/use-workspace-context'
import type { Project, WorkspaceDTO } from '../types'

type WorkspaceContextType = {
    id: string
    name: string
    logoUrl: string | null
    projects?: Project[]
}

const initialWorkspaceState: WorkspaceContextType = {
    id: '',
    name: '',
    logoUrl: null,
    projects: []
}

interface WorkspaceProviderProps {
    workspace: WorkspaceDTO | null
    children: ReactNode
}

export const WorkspaceProvider: FC<WorkspaceProviderProps> = ({ workspace, children }) => {
    const value = {
        id: workspace?.id ?? initialWorkspaceState.id,
        name: workspace?.name ?? initialWorkspaceState.name,
        logoUrl: workspace?.logoUrl ?? initialWorkspaceState.logoUrl,
        projects: workspace?.projects ?? initialWorkspaceState.projects
    }

    return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}
