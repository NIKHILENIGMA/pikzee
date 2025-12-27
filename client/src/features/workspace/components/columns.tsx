import { type ColumnDef } from '@tanstack/react-table'
import { Ellipsis } from 'lucide-react'

import type { ProjectDTO } from '../types'

import ProjectOptions from './project/project-options'

export const columns: ColumnDef<ProjectDTO>[] = [
    {
        accessorKey: 'projectName',
        header: 'Project Name',
        cell: ({ row }) => (
            <div className="w-full p-2 flex items-center space-x-1.5">
                {row.original.projectCoverImageUrl && (
                    <img
                        src={row.original.projectCoverImageUrl || '/placeholder.svg'}
                        alt={row.original.projectName + ' Cover'}
                        className="w-8 h-8 rounded-sm object-cover mr-2"
                    />
                )}
                <span className="font-medium text-md">{row.original.projectName}</span>
            </div>
        )
    },
    {
        accessorKey: 'status',
        header: 'Status'
    },
    {
        accessorKey: 'lastUpdated',
        header: 'Last Updated',
        cell: ({ row }) => {
            const date = new Date(row.original.updatedAt)
            return date.toLocaleDateString()
        }
    },
    {
        accessorKey: 'createdAt',
        header: 'Created Date',
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt)
            return date.toLocaleDateString()
        }
    },
    {
        accessorKey: 'storage',
        header: 'Storage'
    },
    {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => (
            <ProjectOptions
                projectId={row.original.id}
                status={row.original.status}>
                <button
                    type="button"
                    aria-label={`row actions ${row.original.id}`}
                    className="p-1 rounded hover:bg-muted"
                    onClick={(e) => {
                        e.stopPropagation()
                    }}>
                    <Ellipsis className="h-5 w-5" />
                </button>
            </ProjectOptions>
        ),
        enableSorting: false
    }
]
