import { Queue } from 'bullmq'

import { createRedisConnection } from '@/config/redis'

let videoPublishQueue: Queue | null = null

export const getVideoPublishQueue = () => {
    if (!videoPublishQueue) {
        videoPublishQueue = new Queue('video-publish', {
            connection: createRedisConnection('video-publish-queue')
        })
    }

    return videoPublishQueue
}
