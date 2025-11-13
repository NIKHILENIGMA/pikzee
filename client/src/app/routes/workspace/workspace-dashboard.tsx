import { useMemo, useState, type FC } from 'react'

import { Tabs } from '@/components/ui/tabs'
import WorkspaceContent from '@/features/workspace/components/workspace-content'
import WorkspaceHeader from '@/features/workspace/components/workspace-header'
import type { Workspace, Project, ProjectStatus } from '@/features/workspace/types'

const data: Array<Project> = [
    {
        id: '1',
        projectName: 'Youtube Clone',
        status: 'Active',
        projectCoverImage:
            'https://images.unsplash.com/photo-1641716162046-e6fe7ce76818?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735',
        lastUpdated: '2023-01-01',
        createdAt: '2022-12-01',
        storage: 100
    },
    {
        id: '2',
        projectName: 'Discover App',
        status: 'Inactive',
        projectCoverImage:
            'https://plus.unsplash.com/premium_photo-1686255006386-5f58b00ffe9d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600',
        lastUpdated: '2023-01-02',
        createdAt: '2022-12-02',
        storage: 200
    },
    {
        id: '3',
        projectName: 'Social Media App with a Very Long Name to Test Truncation',
        status: 'Active',
        projectCoverImage: '',
        lastUpdated: '2023-01-02',
        createdAt: '2022-12-02',
        storage: 200
    },
    {
        id: '4',
        projectName: 'E-commerce Platform',
        status: 'Active',
        projectCoverImage: '',
        lastUpdated: '2023-01-02',
        createdAt: '2022-12-02',
        storage: 200
    }
]

const currentWorkspace: Workspace = {
    id: 'e250c90f-13ec-4282-a6c2-31794d2477f4',
    name: "Nikhil\t's Workspace",
    slug: 'Nikhil\t-1760458402045',
    ownerId: 'user_32xk6cu6zGi6DrkikD1L3c7do16',
    workspaceLogo: '',
    members: [
        {
            id: 'a3f5e9c2-4b87-4760-9f2b-1d3c6e7a8f90',
            userId: 'e7b1c4d6-2a3f-4b8c-9e0f-5a6d7b8c9e01',
            name: 'Alice Johnson',
            email: 'alice@company.com',
            permission: 'FULL_ACCESS',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600'
        },
        {
            id: 'b4c6d7e8-9f01-2345-6789-0a1b2c3d4e5f',
            userId: 'f0e1d2c3-b4a5-6789-0a1b-2c3d4e5f6a7b',
            name: 'Bob Smith',
            email: 'bob@company.com',
            permission: 'EDIT',
            avatar: 'https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600'
        },
        {
            id: 'c5d6e7f8-9012-3456-7890-1a2b3c4d5e6f',
            userId: 'a1b2c3d4-e5f6-7890-1a2b-3c4d5e6f7g8h',
            name: 'Carol Davis',
            email: 'carol@company.com',
            permission: 'VIEW_ONLY',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600'
        },
        {
            id: 'd6e7f890-1234-5678-9012-3b4c5d6e7f8g',
            userId: 'h9i0j1k2-l3m4-5678-9012-3n4o5p6q7r8s',
            name: 'David Wilson',
            email: 'david@company.com',
            permission: 'COMMENT_ONLY',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600'
        }
    ],
    projects: data
}

const WorkspaceDashboard: FC = () => {
    const [workspace] = useState<Workspace>(currentWorkspace)

    // keep original projects separately so filtering doesn't destroy them
    const [allProjects] = useState<Project[]>(currentWorkspace.projects)

    // selected status (controlled by WorkspaceHeader)
    const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>('All')

    // derive displayed projects from allProjects + selectedStatus
    const displayedProjects = useMemo(() => {
        if (selectedStatus === 'All') return allProjects
        return allProjects.filter((p) => p.status === selectedStatus)
    }, [allProjects, selectedStatus])

    const handleStatusChange = (status: ProjectStatus) => {
        // only update selected status, do not overwrite the original projects
        setSelectedStatus(status)
    }

    return (
        <Tabs defaultValue="grid">
            {/* Header */}
            <WorkspaceHeader onStatusChange={handleStatusChange} />

            {/* Content */}
            <WorkspaceContent workspace={{ ...workspace, projects: displayedProjects }} />
        </Tabs>
    )
}

export default WorkspaceDashboard
