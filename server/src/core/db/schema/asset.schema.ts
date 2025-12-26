import {
    pgTable,
    uuid,
    text,
    bigint,
    integer,
    timestamp,
    pgEnum,
    unique,
    index
} from 'drizzle-orm/pg-core'

import { projects } from './project.schema'
import { users } from './users.schema'

export const assetTypeEnum = pgEnum('asset_type', ['FILE', 'FOLDER'])
export const uploadStatusEnum = pgEnum('upload_status', [
    'UPLOADING',
    'PROCESSING',
    'COMPLETED',
    'FAILED'
])
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
export const acceptedFileTypeEnum = pgEnum('file_type', ['IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO']) // Extend as needed

export const assets = pgTable(
    'assets',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        assetName: text('asset_name').notNull(),
        workspaceId: uuid('workspace_id').notNull(),
        projectId: uuid('project_id')
            .notNull()
            .references(() => projects.id, { onDelete: 'cascade' }),
        parentAssetId: uuid('parent_asset_id'),
        type: assetTypeEnum('type').notNull(),
        path: text('path').notNull(),
        depth: integer('depth').notNull().default(0), // 0 for root, increments by 1 for each level
        mimeType: acceptedMimeTypeEnum('mime_type'),
        s3Key: text('s3_key'),
        imagekitPath: text('imagekit_path'),
        fileSizeBytes: bigint('file_size_bytes', { mode: 'number' }),
        fileType: acceptedFileTypeEnum('file_type'),
        thumbnailPath: text('thumbnail_path'),
        videoDurationSeconds: integer('video_duration_seconds'),
        uploadStatus: uploadStatusEnum('upload_status').default('UPLOADING'),
        createdBy: text('created_by')
            .notNull()
            .references(() => users.id),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
    },
    (table) => [
        unique('unique_assets_project_parent_name').on(
            table.parentAssetId,
            table.assetName,
            table.projectId
        ),
        index('idx_assets_project').on(table.projectId, table.parentAssetId)
    ]
)
