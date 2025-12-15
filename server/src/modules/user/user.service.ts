import { type CreateUser, type User } from '@/core'
import { ConflictError, DatabaseError } from '@/util/StandardError'

import { IUserRepository } from './user.repository'

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

        const payload: CreateUser = {
            id: data.id,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            avatarUrl: data.avatarUrl || null
        }

        const user = await this.userRepository.create(payload)
        if (!user) {
            throw new DatabaseError('Failed to create user', 'USER_CREATION_FAILED')
        }

        return user
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
        const user = await this.userRepository.getByEmail(email)

        if (!user) return null

        return user
    }

    async listAll(): Promise<User[]> {
        return this.userRepository.listAll()
    }
}
