import { pgTable, uuid, text, timestamp, jsonb, pgEnum, boolean } from 'drizzle-orm/pg-core'

import { workspaces } from './workspace.schema'
import { users } from './users.schema'

export const docPermissionEnum = pgEnum('doc_permission', ['private', 'workspace', 'public'])

export const docs = pgTable('docs', {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
        .notNull()
        .references(() => workspaces.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    docImgUrl: text('doc_img_url'), // For document previews
    // Permission & Sharing Logic
    permission: docPermissionEnum('permission').default('workspace').notNull(),
    shareToken: text('share_token').unique(), // For generating public links
    // Soft Deletion Logic
    isArchived: boolean('is_archived').default(false).notNull(),
    archivedAt: timestamp('archived_at', { withTimezone: true }),
    createdBy: text('created_by')
        .notNull()
        .references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})

export const drafts = pgTable('drafts', {
    id: uuid('id').primaryKey().defaultRandom(),
    docId: uuid('doc_id')
        .notNull()
        .references(() => docs.id, { onDelete: 'cascade' }),
    title: text('title'),
    content: jsonb('content'), // Rich text content as JSON
    // Visual Assets
    icon: text('icon'),
    coverImageUrl: text('cover_image_url'),
    coverImageConfig: jsonb('cover_image_config').$type<{
        type: 'S3' | 'URL' | 'unsplash' // For different image sources and handling logic
        positionY: number // 0 to 100 for vertical positioning
        focalPoint: { x: number; y: number } // For advanced cropping
    }>(),
    // View Settings (Stored as JSON for flexibility)
    settings: jsonb('settings')
        .$type<{
            fontStyle: string
            fontSize: string
            isFullWidth: boolean
            showCover: boolean
            showIcon: boolean
            showOwner: boolean
            showLastModified: boolean
        }>()
        .default({
            fontStyle: 'inter',
            fontSize: '16px',
            isFullWidth: false,
            showCover: true,
            showIcon: true,
            showOwner: true,
            showLastModified: true
        }), // Structure: { fontStyle: 'sans', fontSize: string, isFullWidth: boolean, showCover: boolean, showIcon: boolean ... }
    ownerId: text('owner_id')
        .notNull()
        .references(() => users.id),
    lastUpdatedBy: text('last_updated_by')
        .notNull()
        .references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})
