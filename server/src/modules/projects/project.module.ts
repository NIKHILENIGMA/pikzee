import { db } from '@/core/db/connection'
import { ProjectRepository } from './project.repository'
import { ProjectService } from './project.service'
import { ProjectController } from './project.controller'
import { memberRepository } from '../members'

const projectRepository = new ProjectRepository(db)
const projectService = new ProjectService(projectRepository, memberRepository)
const projectController = new ProjectController(projectService)

export { projectService, projectController }
