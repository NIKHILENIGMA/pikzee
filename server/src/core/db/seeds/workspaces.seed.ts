import { logger } from '@/config/logger'
import { db } from '../drizzle'

import { workspaceMembers, workspaces } from '../schema'
import { MemberRecord } from '@/modules/members'

const WORKSPACES = [
    {
        id: '070c13f5-22da-4b04-80d5-631184daeb78',
        name: "Deekshant's Workspace",
        logoUrl: null,
        ownerId: 'user_3BVxKU1xGWIJyKnuEw7vxnORc8w',
        subscription_plan: 'FREE',
        storage_used: 0,
        bandwidth_used: 0,
        is_deleted: false,
        created_at: '2026-03-27 05:06:15.066438',
        updated_at: '2026-03-27 05:06:15.066438'
    },
    {
        id: '28a39aa6-51f7-4929-8e0a-0a58502f0205',
        name: "Soham's Workspace",
        logoUrl: null,
        ownerId: 'user_3BVvOMixzZCCKWwFx3yur4UCpxS',
        subscription_plan: 'FREE',
        storage_used: 0,
        bandwidth_used: 0,
        is_deleted: false,
        created_at: '2026-03-27 04:50:18.090041',
        updated_at: '2026-03-27 04:50:18.090041'
    },
    {
        id: '8b5e745e-4cff-42eb-a118-79506d870102',
        name: "Abhay's Workspace",
        logoUrl: null,
        ownerId: 'user_3BVuV20DJtLheYuv6j44NzYGNWj',
        subscription_plan: 'FREE',
        storage_used: 0,
        bandwidth_used: 0,
        is_deleted: false,
        created_at: '2026-03-27 04:47:49.784512',
        updated_at: '2026-03-27 04:47:49.784512'
    },
    {
        id: 'c1a45cbf-263b-463b-9426-243aab9f527a',
        name: "Nikhil's Workspace",
        logoUrl: null,
        ownerId: 'user_3BVuzq0GGTNRyCWy0mOGp0nKgmy',
        subscription_plan: 'FREE',
        storage_used: 0,
        bandwidth_used: 0,
        is_deleted: false,
        created_at: '2026-03-27 04:47:03.274246',
        updated_at: '2026-03-27 04:47:03.274246'
    }
]

const MEMBERS: MemberRecord[] = [
    {
        id: '633dc64b-45bc-4dfa-b030-b2ff922218e5',
        workspaceId: '070c13f5-22da-4b04-80d5-631184daeb78',
        userId: 'user_3BVxKU1xGWIJyKnuEw7vxnORc8w',
        permission: 'FULL_ACCESS',
        joinedAt: new Date('2026-03-27 05:06:15.066438'),
        updatedAt: new Date('2026-03-27 05:06:15.066438'),
    },
    {
        id: '752273c0-c429-4ac3-9492-b16b25f42009',
        workspaceId: '28a39aa6-51f7-4929-8e0a-0a58502f0205',
        userId: 'user_3BVvOMixzZCCKWwFx3yur4UCpxS',
        permission: 'FULL_ACCESS',
        joinedAt: new Date('2026-03-27 04:50:18.090041'),
        updatedAt: new Date('2026-03-27 04:50:18.090041'),
    },
    {
        id: '8187df9f-da8d-4302-8aa3-a64690ced91b',
        workspaceId: '8b5e745e-4cff-42eb-a118-79506d870102',
        userId: 'user_3BVuV20DJtLheYuv6j44NzYGNWj',
        permission: 'FULL_ACCESS',
        joinedAt: new Date('2026-03-27 04:47:49.784512'),
        updatedAt: new Date('2026-03-27 04:47:49.784512'),
    },
    {
        id: 'a3e311f5-b15b-422a-b0f8-b0e4b0060367',
        workspaceId: 'c1a45cbf-263b-463b-9426-243aab9f527a',
        userId: 'user_3BVuzq0GGTNRyCWy0mOGp0nKgmy',
        permission: 'FULL_ACCESS',
        joinedAt: new Date('2026-03-27 04:47:03.274246'),
        updatedAt: new Date('2026-03-27 04:47:03.274246'),
    },
    {
        id: 'ef8953b9-a29d-4e6f-b9b2-25613f3824ce',
        workspaceId: 'c1a45cbf-263b-463b-9426-243aab9f527a',
        userId: 'user_3BVxKU1xGWIJyKnuEw7vxnORc8w',
        permission: 'EDIT',
        joinedAt: new Date('2026-03-27 04:47:03.274246'),
        updatedAt: new Date('2026-03-27 04:47:03.274246'),
    }
]

export const seedWorkspaces = async () => {
    logger.info('🌱 Seeding workspaces...')

    try {
        await db.insert(workspaces).values(WORKSPACES)
        logger.info('✅ Successfully seeded workspaces in PostgreSQL database')

        await db.insert(workspaceMembers).values(MEMBERS)

        logger.info('✅ Successfully seeded workspace members in PostgreSQL database')
    } catch (error) {
        logger.error(`❌ Error seeding workspaces: ${(error as Error).message}`)
        throw error
    }
}
