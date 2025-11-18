import { pgTable, uuid, varchar, timestamp, boolean, bigint, pgEnum, unique, text } from 'drizzle-orm/pg-core'
import { users } from './users.schema'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

// Enums
export const subscriptionPlanEnum = pgEnum('subscription_plan', ['FREE', 'CREATOR', 'TEAM'])
export const memberPermissionEnum = pgEnum('member_permission', ['FULL_ACCESS', 'EDIT', 'COMMENT_ONLY', 'VIEW_ONLY'])
export const invitationStatusEnum = pgEnum('invitation_status', ['PENDING', 'ACCEPTED', 'EXPIRED', 'CANCELLED'])

// Workspaces Table
export const workspaces = pgTable('workspaces', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    logoUrl: text('logo_url'),
    ownerId: uuid('owner_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    subscriptionPlan: subscriptionPlanEnum('subscription_plan').default('FREE').notNull(),
    storageUsed: bigint('storage_used', { mode: 'number' }).default(0).notNull(),
    bandwidthUsed: bigint('bandwidth_used', { mode: 'number' }).default(0).notNull(),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// Workspace Members Table
export const workspaceMembers = pgTable(
    'workspace_members',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        workspaceId: uuid('workspace_id')
            .notNull()
            .references(() => workspaces.id, { onDelete: 'cascade' }),
        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        permission: memberPermissionEnum('permission').default('COMMENT_ONLY').notNull(),
        joinedAt: timestamp('joined_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at').defaultNow().notNull()
    },
    (table) => [
        {
            uniqueMember: unique().on(table.workspaceId, table.userId)
        }
    ]
)

// Invitations Table
export const invitations = pgTable('invitations', {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
        .notNull()
        .references(() => workspaces.id, { onDelete: 'cascade' }),
    inviterUserId: uuid('inviter_user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    inviteeEmail: varchar('invitee_email', { length: 255 }).notNull(),
    permission: memberPermissionEnum('permission').notNull(),
    token: varchar('token', { length: 500 }).notNull().unique(),
    status: invitationStatusEnum('status').default('PENDING').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
})

export type Workspace = InferSelectModel<typeof workspaces>
export type CreateWorkspace = InferInsertModel<typeof workspaces>

export type WorkspaceMember = InferSelectModel<typeof workspaceMembers>
export type CreateWorkspaceMember = InferInsertModel<typeof workspaceMembers>

export type Invitation = InferSelectModel<typeof invitations>
export type CreateInvitation = InferInsertModel<typeof invitations>
