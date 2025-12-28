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
        header: 'Storage',
        cell: ({ row }) => {
            const sizeInBytes = row.original.storageUsed
            if (sizeInBytes < 1024) {
                return `${sizeInBytes} Bytes`
            } else if (sizeInBytes < 1048576) {
                return `${(sizeInBytes / 1024).toFixed(2)} KB`
            } else if (sizeInBytes < 1073741824) {
                return `${(sizeInBytes / 1048576).toFixed(2)} MB`
            } else {
                return `${(sizeInBytes / 1073741824).toFixed(2)} GB`
            }
        }
    },
    {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => (
            <ProjectOptions
                projectId={row.original.id}
                status={row.original.status}
                projectName={row.original.projectName}
                projectCoverImageUrl={row.original.projectCoverImageUrl || '/placeholder.svg'}>
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
