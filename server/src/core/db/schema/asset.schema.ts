import {
    pgTable,
    uuid,
    integer,
    timestamp,
    pgEnum,
    text,
    varchar,
    uniqueIndex,
    AnyPgColumn
} from 'drizzle-orm/pg-core'

import { projects } from './project.schema'

// Enum for accepted MIME types for assets
export const acceptedMimeTypeEnum = pgEnum('mime_type', [
    'image/jpeg', // .jpg, .jpeg
    'image/png', // .png
    'image/webp', // .webp
    'video/mp4', // .mp4
    'video/quicktime', // .mov
    'video/webm', // .webm
    'application/pdf', // .pdf
    'text/plain', // .txt
    'audio/mpeg', // .mp3
    'audio/webm' // .webm
])

export type AcceptedMimeType = 'image/jpeg' | 'image/png' | 'image/webp' | 'video/mp4' | 'video/quicktime' | 'video/webm' | 'application/pdf' | 'text/plain' | 'audio/mpeg' | 'audio/webm'

// Asset status enum to track the processing state of the asset
export const assetStatusEnum = pgEnum('asset_status', ['PENDING', 'READY', 'FAILED'])

export const assets = pgTable('assets', {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
        .notNull()
        .references(() => projects.id),
    folderId: uuid('folder_id')
        .references(() => folders.id),

    name: varchar('name', { length: 255 }).notNull(),
    s3Key: text('s3_key').notNull().unique(),
    mimeType: acceptedMimeTypeEnum('mime_type').notNull(),
    sizeBytes: integer('size_bytes').notNull(),

    status: assetStatusEnum('status').default('PENDING').notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const folders = pgTable(
    'folders',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        projectId: uuid('project_id')
            .notNull()
            .references(() => projects.id),

        // Self-referencing foreign key. If null, it's in the project root.
        parentId: uuid('parent_id').references((): AnyPgColumn => folders.id),

        name: varchar('name', { length: 255 }).notNull(),

        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at').defaultNow().notNull()
    },
    (table) => [
        uniqueIndex('unq_folder_name_parent').on(table.projectId, table.parentId, table.name)
    ]
)
