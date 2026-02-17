import { integer, json, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { projects } from './project.schema'
import { users } from './users.schema'

export const socialPlatformEnum = pgEnum('social_platform', ['YOUTUBE', 'LINKEDIN', 'TWITTER'])

export const socialAccountStatusEnum = pgEnum('social_account_status', [
    'CONNECTED',
    'EXPIRED',
    'REVOKED'
])

export const socialPostStatusEnum = pgEnum('social_post_status', [
    'DRAFT',
    'UPLOADING',
    'PUBLISHED',
    'FAILED'
])

export const socialAccounts = pgTable('social_accounts', {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
        .notNull()
        .references(() => projects.workspaceId, { onDelete: 'cascade' }),
    platform: socialPlatformEnum('platform').notNull(),
    platformUserId: text('platform_user_id').notNull(),
    platformAvatarUrl: text('platform_avatar_url'),
    accountName: text('account_name').notNull(),
    accessToken: text('access_token').notNull(),
    refreshToken: text('refresh_token').notNull(),
    accessTokenExpiresAt: integer('access_token_expires_at'),
    scope: text('scope'),
    status: socialAccountStatusEnum('status').notNull().default('CONNECTED'),
    createdBy: text('created_by')
        .notNull()
        .references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const socialPosts = pgTable('social_posts', {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
        .notNull()
        .references(() => projects.workspaceId, { onDelete: 'cascade' }),
    socialAccountId: uuid('social_account_id')
        .notNull()
        .references(() => socialAccounts.id, { onDelete: 'cascade' }),
    assetId: uuid('asset_id').notNull(), // FK to assets table for video/image
    platform: socialPlatformEnum('platform').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    tags: json('tags'), // Store as comma-separated string or JSON string
    visibility: text('visibility').notNull(), // Could be an enum if platforms have consistent options
    platformPostId: text('platform_post_id'), // e.g., YouTube video ID
    platformUrl: text('platform_url'),
    status: socialPostStatusEnum('status').notNull().default('DRAFT'),
    errorMessage: text('error_message'),
    publishedAt: timestamp('published_at'),
    createdBy: text('created_by')
        .notNull()
        .references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
})
