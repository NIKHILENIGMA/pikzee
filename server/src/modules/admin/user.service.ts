import { CreateUser, db, User, users } from '@/core'
import { eq } from 'drizzle-orm'

export class UserService {
    constructor() {}

    async upsertClerkUser(userData: CreateUser): Promise<User> {
        const [existing] = await db.select().from(users).where(eq(users.email, userData.email)).limit(1)

        if (existing) {
            return existing // Idempotent: return existing user if already present
        } else {
            // Create new user record
            const [newUser] = await db.insert(users).values(userData).returning()
            return newUser
        }
    }

    async getUserById(userId: string): Promise<User | null> {
        const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
        return user || null
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
        return user || null
    }

    async listAllUsers(): Promise<User[]> {
        return await db.select().from(users)
    }

    async createUser(userData: CreateUser): Promise<User> {
        const [newUser] = await db.insert(users).values(userData).returning()
        return newUser
    }

    async updateUser(userId: string, updateData: Partial<CreateUser>): Promise<User | null> {
        const [updatedUser] = await db.update(users).set(updateData).where(eq(users.id, userId)).returning()
        return updatedUser || null
    }

    async deleteUser(userId: string): Promise<User | null> {
        const [deletedUser] = await db.delete(users).where(eq(users.id, userId)).returning()

        return deletedUser || null
    }
}
