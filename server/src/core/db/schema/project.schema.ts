import {
    bigint,
    boolean,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar
} from 'drizzle-orm/pg-core'

import { workspaces } from './workspace.schema'

export const ProjectStatusEnum = pgEnum('project_status', ['ACTIVE', 'INACTIVE', 'ARCHIVED'])

export const projects = pgTable('projects', {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
        .notNull()
        .references(() => workspaces.id, { onDelete: 'cascade' }),
    projectName: varchar('project_name', { length: 255 }).notNull(),
    projectCoverImageUrl: text('project_cover_image_url'),
    projectOwnerId: text('project_owner_id').notNull(),
    storageUsed: bigint('storage_used', { mode: 'number' }).default(0).notNull(),
    status: ProjectStatusEnum('status').default('ACTIVE').notNull(),
    isAccessRestricted: boolean('is_access_restricted').default(false).notNull(),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
})
