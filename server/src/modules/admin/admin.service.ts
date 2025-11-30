import { User } from '@/core'
import { UserService } from './user.service'

export class AdminService {
    constructor(private userService: UserService) {}

    async getUserById(userId: string) {
        return await this.userService.getUserById(userId)
    }

    async listAllUsers() {
        return await this.userService.listAllUsers()
    }

    async updateUser(userId: string, updateData: Partial<User>) {
        return await this.userService.updateUser(userId, updateData)
    }

    async deleteUser(userId: string) {
        return await this.userService.deleteUser(userId)
    }
}
