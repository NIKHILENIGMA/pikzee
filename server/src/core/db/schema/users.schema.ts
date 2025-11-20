import { pgTable, varchar, timestamp, text, boolean } from 'drizzle-orm/pg-core'
import { InferInsertModel, type InferSelectModel } from 'drizzle-orm'

// todo: add last_active_workspace_id field to track last active workspace

export const users = pgTable('users', {
    id: varchar('id', { length: 100 }).notNull().primaryKey(),
    firstName: varchar('first_name', { length: 100 }),
    lastName: varchar('last_name', { length: 100 }),
    email: varchar('email', { length: 255 }).notNull().unique(),
    avatarUrl: text('avatar_url'),
    isActive: boolean('is_active').notNull().default(true),
    lastActiveWorkspaceId: text('last_active_workspace_id'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export type User = InferSelectModel<typeof users>
export type CreateUser = InferInsertModel<typeof users>
