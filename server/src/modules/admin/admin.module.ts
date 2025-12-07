import { userService } from '../user'
import { AdminController } from './admin.controller'
import { AdminService, IAdminService } from './admin.service'

// Instantiate the service and controller
const adminService = new AdminService(userService)
const adminController = new AdminController(adminService)

// Export the instances and interfaces
export { adminService, IAdminService, adminController }
