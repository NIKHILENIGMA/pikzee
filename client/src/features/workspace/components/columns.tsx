import { type ColumnDef } from '@tanstack/react-table'

import type { Project } from '../types'

import ProjectPopover from './project/project-popover'

export const columns: ColumnDef<Project>[] = [
    {
        accessorKey: 'projectName',
        header: 'Project Name',
        cell: ({ row }) => (
            <div className="w-full p-2 flex items-center space-x-1.5">
                {row.original.projectCoverImage && (
                    <img
                        src={row.original.projectCoverImage || '/placeholder.svg'}
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
            const date = new Date(row.original.lastUpdated)
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
            <button
                type="button"
                aria-label={`row actions ${row.original.id}`}
                className="p-1 rounded hover:bg-muted"
                onClick={(e) => {
                    e.stopPropagation()
                }}>
                <ProjectPopover />
            </button>
        ),
        enableSorting: false
    }
]
