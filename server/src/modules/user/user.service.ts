import { type CreateUser, type User } from '@/core'
import { IUserRepository } from './user.repository'
import { ConflictError, InternalServerError } from '@/util/StandardError'
import { clerkClient } from '@clerk/express'

export interface IUserService {
    createUser(data: CreateUser): Promise<User>
    updateUser(userId: string, data: Partial<User>): Promise<User>
    deleteUser(userId: string): Promise<User>
    getUserById(userId: string): Promise<User | null>
    getUserByEmail(email: string): Promise<User | null>
    listAll(): Promise<User[]>
}

export class UserService implements IUserService {
    constructor(private readonly userRepository: IUserRepository) {}

    async createUser(data: CreateUser): Promise<User> {
        const userExists = await this.userRepository.getByEmail(data.email)
        if (userExists) {
            throw new ConflictError('Email already in use', 'email')
        }

        // Create user in Clerk authentication service
        const clerkUser = await clerkClient.users.createUser({
            emailAddress: [data.email],
            firstName: data.firstName!,
            lastName: data.lastName || ''
        })

        if (!clerkUser) {
            throw new InternalServerError(
                'Failed to create user in authentication service',
                'AUTH_SERVICE_USER_CREATION_FAILED'
            )
        }

        // Create user in local database with Clerk-generated ID
        const newUser = {
            ...data,
            id: clerkUser.id // Use Clerk-generated user ID
        }

        return this.userRepository.create(newUser)
    }

    async updateUser(userId: string, data: Partial<User>): Promise<User> {
        return this.userRepository.update(userId, data)
    }

    async deleteUser(userId: string): Promise<User> {
        return this.userRepository.delete(userId)
    }

    async getUserById(userId: string): Promise<User | null> {
        return this.userRepository.getById(userId)
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return this.userRepository.getByEmail(email)
    }

    async listAll(): Promise<User[]> {
        return this.userRepository.listAll()
    }

}
