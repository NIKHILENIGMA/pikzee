import { json, pgEnum, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core'

import { users } from './users.schema'
import { workspaces } from './workspace.schema'

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

export const visibilityEnum = pgEnum('social_visibility', ['PUBLIC', 'PRIVATE', 'UNLISTED'])

export const socialAccounts = pgTable(
    'social_accounts',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        workspaceId: uuid('workspace_id')
            .notNull()
            .references(() => workspaces.id, { onDelete: 'cascade' }),
        platform: socialPlatformEnum('platform').notNull(),
        platformUserId: text('platform_user_id').notNull(),
        avatarUrl: text('avatar_url'),
        coverUrl: text('cover_url'),
        accountName: text('account_name').notNull(),
        accessToken: text('access_token').notNull(),
        refreshToken: text('refresh_token').notNull(),
        accessTokenExpiresAt: timestamp('access_token_expires_at'),
        scope: text('scope'),
        status: socialAccountStatusEnum('status').notNull().default('CONNECTED'),
        userId: text('user_id')
            .notNull()
            .references(() => users.id),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at').defaultNow().notNull()
    },
    (table) => [
        {
            uniqueWorkspacePlatformUser: unique().on(
                table.workspaceId,
                table.platformUserId,
                table.platform
            )
        }
    ]
)

export const socialPosts = pgTable('social_posts', {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
        .notNull()
        .references(() => workspaces.id, { onDelete: 'cascade' }),
    socialAccountId: uuid('social_account_id')
        .notNull()
        .references(() => socialAccounts.id, { onDelete: 'cascade' }),
    platform: socialPlatformEnum('platform').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    tags: json('tags'),
    visibility: visibilityEnum('visibility').notNull(),
    platformPostId: text('platform_post_id'), // e.g., YouTube video ID
    platformUrl: text('platform_url'),
    status: socialPostStatusEnum('status').notNull().default('DRAFT'),
    errorMessage: text('error_message'),
    publishedAt: timestamp('published_at'),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
})
