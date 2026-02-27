import { Platforms, smartPublishService } from '@/modules/smart-publish'
import { Worker } from 'bullmq'
import { createRedisConnection } from '@/config/redis'
// import { logger } from '@/config';

export const worker = new Worker(
    'video-publish',
    async (job: { data: { videoPostId: string; platform: Platforms } }) => {
        const { videoPostId, platform } = job.data

        await smartPublishService.processVideoPublish(videoPostId, platform)

        return true
    },
    { connection: createRedisConnection('video-publish-worker') }
)
