import { CreateUser, User } from '@/core'
import { UserService } from './user.service'
import { clerkClient } from '@clerk/express'

export class AdminService {
    constructor(private userService: UserService) {}

    async getUserById(userId: string) {
        return await this.userService.getUserById(userId)
    }

    async listAllUsers() {
        return await this.userService.listAllUsers()
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

    async deleteUser(userId: string) {
        return await this.userService.deleteUser(userId)
    }
}
