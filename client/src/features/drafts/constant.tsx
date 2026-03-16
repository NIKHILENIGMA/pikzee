import { Clock, Image, Smile, User } from 'lucide-react'

import type { DraftDTO, DraftSettingType, DraftSidebarDTO, FontSize, FontStyle, PageWidth } from './types/draft.types'

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
    }
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
            positionY: 10,
            focalPoint: {
                x: 0,
                y: 0
            }
        },
        settings: {
            fontStyle: 'serif',
            fontSize: '25px',
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
        icon: '📄',
        coverImageUrl: null,
        coverImageConfig: {
            type: 'S3',
            positionY: 80,
            focalPoint: {
                x: 0,
                y: 0
            }
        },
        settings: {
            fontStyle: 'mono',
            fontSize: '25px',
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

type Option<T> = {
    label: string
    value: T
    icon?: React.ReactNode
}

interface VisibilityOption {
    label: string
    key: keyof DraftSettingType
    icon: React.ReactNode
}

export const visibilityOptions: VisibilityOption[] = [
    {
        label: 'Show Cover Image',
        key: 'showCover',
        icon: <Image />
    },
    {
        label: 'Show Page Icon',
        key: 'showIcon',
        icon: <Smile />
    },
    {
        label: 'Show Owner Name & Last Updated Time',
        key: 'showOwner',
        icon: <User />
    },
    {
        label: 'Show Last Updated Time',
        key: 'showLastModified',
        icon: <Clock />
    }
]

export const fontStyleOptions: Option<FontStyle>[] = [
    { label: 'System', value: 'sans', icon: 'Aa' },
    { label: 'Serif', value: 'serif', icon: 'Ss' },
    { label: 'Mono', value: 'mono', icon: '00' }
]

export const fontSizeOptions: Option<FontSize>[] = [
    { label: 'Small', value: '16px', icon: 'Aa≡' },
    { label: 'Default', value: '25px', icon: 'Aa≡' },
    { label: 'Large', value: '36px', icon: 'Aa≡' }
]

export const pageWidthOptions: Option<PageWidth>[] = [
    { label: 'Default', value: 'default' },
    { label: 'Full width', value: 'full' }
]
