import { db, users } from '@/core'
import { DatabaseError, StandardError } from '@/util'
import { eq } from 'drizzle-orm'

export class AdminService {
    private static instance: AdminService

    private constructor() {}

    public static getInstance(): AdminService {
        if (!AdminService.instance) {
            AdminService.instance = new AdminService()
        }
        return AdminService.instance
    }

    async getUserById(userId: string) {
        try {
            return await db.select().from(users).where(eq(users.id, userId)).limit(1)
        } catch (error) {
            if (error instanceof StandardError) {
                throw error
            }

            throw new DatabaseError('Failed to fetch user by ID', 'adminService.getUserById')
        }
    }
}

export const adminService = AdminService.getInstance()

