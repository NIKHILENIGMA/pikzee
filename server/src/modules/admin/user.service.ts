import { CreateUser, db, User, users } from '@/core'
import { eq } from 'drizzle-orm'

export class UserService {
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
}
