import { logger } from '@/config/logger'
import { db } from '../drizzle'
import { subscriptions, Subscription } from '../schema/subscription.schema'

const subscriptionData: Omit<Subscription, 'plan'>[] = [
    {
        workspaces: 1,
        projectsPerWorkspace: 2,
        membersPerWorkspace: 2,
        bandwidth: 1073741824, // 1 GB
        storage: 524288000, // 500 MB
        docsPerWorkspace: 10,
        socialPlatforms: ['youtube']
    },
    {
        workspaces: 1,
        projectsPerWorkspace: 5,
        membersPerWorkspace: 5,
        bandwidth: 16106127360, // 15 GB
        storage: 10737418240, // 10 GB
        docsPerWorkspace: 25,
        socialPlatforms: ['youtube', 'linkedin', 'twitter']
    },
    {
        workspaces: 5,
        projectsPerWorkspace: 10,
        membersPerWorkspace: 10,
        bandwidth: 42949672960, // 40 GB
        storage: 26843545600, // 25 GB
        docsPerWorkspace: -1, // Unlimited
        socialPlatforms: ['all']
    }
]

export const seedTiers = async () => {
    logger.info('🌱 Seeding subscription tiers...')

    try {
        await db.delete(subscriptions)
        logger.info('🗑️ Cleared existing tiers')
        subscriptionData.forEach(async (data, index) => {
            const plan = index === 0 ? 'FREE' : index === 1 ? 'CREATOR' : 'TEAM'
            await db.insert(subscriptions).values({ plan, ...data })
            logger.info(`✅ Seeded ${plan} tier`)
        })
        logger.info('🌱 Successfully seeded all subscription tiers')
    } catch (error) {
        logger.error(`❌ Error seeding tiers: ${(error as Error).message}`)
        throw error
    }
}
