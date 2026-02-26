import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core'

import { workspaces } from './workspace.schema'
import { users } from './users.schema'

export const docs = pgTable('docs', {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
        .notNull()
        .references(() => workspaces.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
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
    icon: text('icon'), // Emoji or icon identifier
    coverImageUrl: text('cover_image_url'),
    ownerId: text('owner_id')
        .notNull()
        .references(() => users.id),
    lastUpdatedBy: text('last_updated_by')
        .notNull()
        .references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})

