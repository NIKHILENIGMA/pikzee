import { Redis } from 'ioredis'

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1'
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379)

export const createRedisConnection = (connectionName: string) => {
    const connection = new Redis({
        host: REDIS_HOST,
        port: REDIS_PORT,
        lazyConnect: true,
        maxRetriesPerRequest: null,
        enableOfflineQueue: false,
        retryStrategy: (times: number) => {
            if (times > 15) {
                return null
            }
            return Math.min(times * 200, 2000)
        }
    })

    connection.on('error', (error) => {
        console.error(`[redis:${connectionName}] ${error.message}`)
    })

    return connection
}
