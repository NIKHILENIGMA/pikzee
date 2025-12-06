import { db } from '@/core/db/connection'

import { WorkspaceController } from './workspace.controller'
import { WorkspaceRepository } from './workspace.repository'
import { WorkspaceService } from './workspace.service'

// Import dependent services
import { userService } from '../user'
import { memberService } from '../members'

// Create repository instances with database connection
const workspaceRepository = new WorkspaceRepository(db)

// Create service instance with dependencies
const workspaceService = new WorkspaceService(workspaceRepository, memberService, userService)

const workspaceController = new WorkspaceController(workspaceService)

// Export the instances for use in other parts of the application
export { workspaceService, workspaceController }
