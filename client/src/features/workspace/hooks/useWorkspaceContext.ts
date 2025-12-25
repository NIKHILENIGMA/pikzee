import { createContext, useContext } from 'react'
import type { Project } from '../types'

type WorkspaceContextType = {
    id: string
    name: string
    logoUrl: string | null
    projects?: Project[]
} | null

export const WorkspaceContext = createContext<WorkspaceContextType>(null)

export const useWorkspaceContext = () => {
    const context = useContext(WorkspaceContext)
    if (!context) {
        throw new Error('useWorkspaceContext must be used within a WorkspaceProvider')
    }

    return context
}
