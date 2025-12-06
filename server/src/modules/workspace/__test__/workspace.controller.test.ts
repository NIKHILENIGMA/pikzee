import createApp from '@/app'
import request from 'supertest'
import { describe, expect, it } from 'vitest'

describe('Workspace Controller', () => {
    it('should create a workspace for a user', async () => {
        // Arrange
        const endpoint = '/api/v1/workspaces'
        const userId = 'user-123'
        const workspacePayload = {
            name: 'Sam Workspace'
        }

        // Act
        const res = await request(createApp).post(endpoint).send(workspacePayload)

        // Assert
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toMatchObject({
            workspace: {
                id: expect.toString(),
                name: 'Sam Workspace',
                ownerId: userId,
                workspaceLogoUrl: expect.toString() || null,
                createdAt: expect.toString()
            }
        })
    })
})
