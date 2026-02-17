import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { pgTable, integer, bigint, text } from 'drizzle-orm/pg-core'

import { subscriptionPlanEnum } from './workspace.schema'

export const subscriptions = pgTable('subscriptions', {
    plan: subscriptionPlanEnum('plan').primaryKey(),
    workspaces: integer('workspaces').notNull(),
    projectsPerWorkspace: integer('projects_per_workspace').notNull(),
    membersPerWorkspace: integer('members_per_workspace').notNull(),
    bandwidth: bigint('bandwidth', { mode: 'number' }).notNull(), // in bytes
    storage: bigint('storage', { mode: 'number' }).notNull(), // in bytes
    docsPerWorkspace: integer('docs_per_workspace').notNull(), // -1 for unlimited
    socialPlatforms: text('social_platforms').array().notNull()
})

export type Subscription = InferSelectModel<typeof subscriptions>
export type CreateSubscription = InferInsertModel<typeof subscriptions>
