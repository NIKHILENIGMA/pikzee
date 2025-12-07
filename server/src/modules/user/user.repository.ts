import { CreateUser, User, users } from '@/core'
import { DatabaseConnection } from '@/core/db/service/database.service'
import { DatabaseError } from '@/util'
import { eq } from 'drizzle-orm/sql/expressions/conditions'

export interface IUserRepository {
    create(data: CreateUser): Promise<User>
    update(userId: string, data: Partial<User>): Promise<User>
    delete(userId: string): Promise<User>
    getById(userId: string): Promise<User | null>
    getByEmail(email: string): Promise<User | null>
    listAll(): Promise<User[]>
}

export class UserRepository implements IUserRepository {
    constructor(private readonly db: DatabaseConnection) {}

    async create(data: CreateUser): Promise<User> {
        const [user] = await this.db.insert(users).values(data).returning()

        if (!user) {
            throw new DatabaseError('Failed to create user', 'USER_CREATION_FAILED')
        }

        return user
    }

    async update(userId: string, data: Partial<User>): Promise<User> {
        const [updatedUser] = await this.db
            .update(users)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(users.id, userId))
            .returning()

        if (!updatedUser) {
            throw new DatabaseError('Failed to update user', 'USER_UPDATE_FAILED')
        }

        return updatedUser
    }

    async delete(userId: string): Promise<User> {
        const [deletedUser] = await this.db
            .update(users)
            .set({
                isActive: false,
                updatedAt: new Date()
            })
            .where(eq(users.id, userId))
            .returning()

        if (!deletedUser) {
            throw new DatabaseError('Failed to delete user', 'USER_DELETION_FAILED')
        }

        return deletedUser
    }

    async getById(userId: string): Promise<User | null> {
        const [user] = await this.db.select().from(users).where(eq(users.id, userId))

        if (!user) {
            return null
        }

        return user
    }

    async getByEmail(email: string): Promise<User | null> {
        const [user] = await this.db.select().from(users).where(eq(users.email, email))

        if (!user) {
            return null
        }

        return user
    }

    async listAll(): Promise<User[]> {
        const allUsers = await this.db.select().from(users)
        return allUsers
    }
}
