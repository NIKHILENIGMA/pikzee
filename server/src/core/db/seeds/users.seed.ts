/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { logger } from '@/config/logger'
import { db } from '../drizzle'

import { users } from '../schema'

const USERS = [
    {
        id: 'user_3BVuV20DJtLheYuv6j44NzYGNWj',
        first_name: 'Abhay',
        last_name: 'Sharma',
        email: 'karankumarsharma834@gmail.com',
        avatar_url:
            'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zQlZ1VXo3Q3dqeXBBZHMwYUdDbE16TDMwSGgifQ',
        is_active: true,
        default_workspace_id: '8b5e745e-4cff-42eb-a118-79506d870102',
        last_active_workspace_id: null,
        created_at: '2026-03-27 04:47:49.784512',
        updated_at: '2026-03-27 04:47:49.793'
    },
    {
        id: 'user_3BVuzq0GGTNRyCWy0mOGp0nKgmy',
        first_name: 'Nikhil',
        last_name: 'Harmalkar',
        email: 'nickharmalkar18@gmail.com',
        avatar_url:
            'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zQlZ1enFVNGFIZ1IyR2I3dTgwaWltVWFDZ1IifQ',
        is_active: true,
        default_workspace_id: 'c1a45cbf-263b-463b-9426-243aab9f527a',
        last_active_workspace_id: null,
        created_at: '2026-03-27 04:47:03.274246',
        updated_at: '2026-03-27 04:47:03.304'
    },
    {
        id: 'user_3BVvOMixzZCCKWwFx3yur4UCpxS',
        first_name: 'Soham',
        last_name: 'Jambekar',
        email: 'jambekarsoham7@gmail.com',
        avatar_url:
            'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zQlZ2T01WczUzQzZxSzlDbDVJQ2NMaE5kenkifQ',
        is_active: true,
        default_workspace_id: '28a39aa6-51f7-4929-8e0a-0a58502f0205',
        last_active_workspace_id: null,
        created_at: '2026-03-27 04:50:18.090041',
        updated_at: '2026-03-27 04:50:18.104'
    },
    {
        id: 'user_3BVxKU1xGWIJyKnuEw7vxnORc8w',
        first_name: 'Deekshant',
        last_name: 'Rahangdale',
        email: 'deekshantrahangdale07@gmail.com',
        avatar_url:
            'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zQlZ4S1RhajVxTVIwT0tJV3VmRzlKVFBiMm4ifQ',
        is_active: true,
        default_workspace_id: '070c13f5-22da-4b04-80d5-631184daeb78',
        last_active_workspace_id: 'c1a45cbf-263b-463b-9426-243aab9f527a',
        created_at: '2026-03-27 05:06:15.066438',
        updated_at: '2026-03-27 05:09:07.768'
    }
]

export const seedUsers = async () => {
    try {
        logger.info('🌱 Creating users in Clerk...')

        await db.insert(users).values(USERS)

        logger.info('✅ Successfully seeded users in PostgreSQL database')
    } catch (error) {
        logger.error(`❌ Error seeding users: ${(error as Error).message}`)
        throw error
    }
}
