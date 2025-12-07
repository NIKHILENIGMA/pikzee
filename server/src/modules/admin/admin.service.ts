import { clerkClient } from '@clerk/express'

import { CreateUser, User } from '@/core'

import { IUserService } from '../user'

export interface IAdminService {
    getUserById(userId: string): Promise<User | null>
    listAllUsers(): Promise<User[]>
    createUser(userData: CreateUser): Promise<User>
    updateUser(userId: string, updateData: Partial<User>): Promise<User | null>
    deleteUser(userId: string): Promise<void>
}

export class AdminService implements IAdminService {
    constructor(private userService: IUserService) {}

    async getUserById(userId: string) {
        return await this.userService.getUserById(userId)
    }

    async listAllUsers() {
        return await this.userService.listAll()
    }

    async createUser(userData: CreateUser) {
        const newUserInClerk = await clerkClient.users.createUser({
            firstName: userData.firstName!,
            lastName: userData.lastName!,
            emailAddress: [userData.email],
            password: 'TemporaryPassword123!' // In a real application, handle passwords securely
        })

        return await this.userService.createUser({
            id: newUserInClerk.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            avatarUrl: userData.avatarUrl
        })
    }

    async updateUser(userId: string, updateData: Partial<User>) {
        return await this.userService.updateUser(userId, updateData)
    }

    async deleteUser(userId: string): Promise<void> {
        await this.userService.deleteUser(userId)
    }
}
