import z from 'zod'

import { WorkspaceIdSchema } from '@/modules/workspace/workspace.validator'

export const addMemberSchema = z.object({
    inviteeUserId: z.string().min(1, { message: 'User ID is required' }).trim(),
    permission: z.enum(['FULL_ACCESS', 'EDIT', 'COMMENT_ONLY', 'VIEW_ONLY'])
})

export const updateMemberPermissionSchema = z.object({
    permission: z.enum(['FULL_ACCESS', 'EDIT', 'COMMENT_ONLY', 'VIEW_ONLY'])
})

export const workspaceMemberIdSchema = WorkspaceIdSchema.extend({
    memberId: z.uuid().nonempty()
})
