import type { DraftDTO, DraftSidebarDTO } from './types/draft.types'


export const pages: DraftSidebarDTO[] = [
    {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Some random title',
        icon: null,
        updatedAt: new Date()
    },
    {
        id: '660e8400-e29b-41d4-a716-446655440001',
        title: 'Page 2',
        icon: '📄',
        updatedAt: new Date()
    },
]

export const mockDrafts: DraftDTO[] = [
    {
        id: '550e8400-e29b-41d4-a716-446655440000',
        ownerId: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Some random title',
        docId: '123e4567-e89b-12d3-a456-426614174001',
        content: {},
        icon: '❤️',
        coverImageUrl: null,
        coverImageConfig: {
            type: 'S3',
            positionY: 0,
            focalPoint: {
                x: 0,
                y: 0
            }
        },
        settings: {
            fontStyle: 'mono',
            fontSize: '24px',
            isFullWidth: false,
            showCover: true,
            showOwner: true,
            showIcon: true,
            showLastModified: true
        },
        lastUpdatedBy: '',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: '660e8400-e29b-41d4-a716-446655440001',
        ownerId: '123e4567-e89b-12d3-a456-426614174000',
        title: null,
        docId: '123e4567-e89b-12d3-a456-426614174001',
        content: {},
        icon: null,
        coverImageUrl: null,
        coverImageConfig: {
            type: 'S3',
            positionY: 0,
            focalPoint: {
                x: 0,
                y: 0
            }
        },
        settings: {
            fontStyle: 'inter',
            fontSize: '24px',
            isFullWidth: false,
            showCover: true,
            showOwner: true,
            showIcon: true,
            showLastModified: true
        },
        lastUpdatedBy: '',
        createdAt: new Date(),
        updatedAt: new Date()
    }
]
