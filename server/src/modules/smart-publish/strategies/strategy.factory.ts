import { googleConfig } from '@/config'
import { IWorkspaceRepository } from '../../workspace/workspace.repository'
import { IPublishRepository } from '../smart-publish.repository'
import { Platforms } from '../smart-publish.types'
import { IPlatformStrategy } from './platform.strategy'
import { YouTubeStrategy } from './youtube.strategy'
import { BadRequestError } from '@/util'

export class StrategyFactory {
    private strategies: Map<Platforms, IPlatformStrategy>

    constructor(
        smartPublishRepository: IPublishRepository,
        workspaceRepository: IWorkspaceRepository,
        config: typeof googleConfig
    ) {
        this.strategies = new Map()
        this.strategies.set(
            'YOUTUBE',
            new YouTubeStrategy(smartPublishRepository, workspaceRepository, config)
        )
    }

    get(platform: Platforms): IPlatformStrategy {
        const strategy = this.strategies.get(platform)
        if (!strategy) {
            throw new BadRequestError(`Unsupported platform: ${platform}`, 'UNSUPPORTED_PLATFORM')
        }
        return strategy
    }
}
