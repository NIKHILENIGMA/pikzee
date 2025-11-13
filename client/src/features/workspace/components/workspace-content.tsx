import { useState, type FC } from 'react'

import ContentLayout from '@/components/layout/content-layout'
import { TabsContent } from '@/components/ui/tabs'
import { columns } from '@/features/workspace/components/columns'

import type { Project, Workspace } from '../types'

import ContentHeader from './content-header'
import MembersDialog from './members-dialog'
import ProjectGrid from './project/project-grid'
import ProjectTable from './project/project-table'

interface WorkspaceContentProps {
    workspace: Workspace
}

const WorkspaceContent: FC<WorkspaceContentProps> = ({ workspace }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
    const [showMembers, setShowMembers] = useState<boolean>(false)

    return (
        <ContentLayout>
            <ContentHeader
                name={workspace.name}
                noOfProjects={workspace.projects.length}
                onShowMembers={() => setShowMembers(true)}
                onSettingsOpen={() => setIsSettingsOpen(true)}
                members={workspace.members}
            />
            {/* Grid View */}
            <TabsContent value="grid">
                <ProjectGrid
                    toggleSettings={isSettingsOpen}
                    onSettingsChange={setIsSettingsOpen}
                    workspace={workspace}
                />
            </TabsContent>
            {/* Table View */}
            <TabsContent value="table">
                <div className="w-full min-h-[40vh] mx-auto">
                    <ProjectTable<Project, unknown>
                        columns={columns}
                        data={workspace.projects}
                    />
                </div>
            </TabsContent>

            {/* Members Dialog */}
            <MembersDialog
                showMembers={showMembers}
                setShowMembers={setShowMembers}
                workspace={workspace}
            />
        </ContentLayout>
    )
}

export default WorkspaceContent
