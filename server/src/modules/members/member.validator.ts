import z from 'zod'

import { memberPermissionEnum } from '@/core/db/schema/workspace.schema'
import { WorkspaceIdSchema } from '@/modules/workspace/workspace.validator'

export const AddMemberSchema = z.object({
    inviteeUserId: z.string().min(1, { message: 'User ID is required' }).trim(),
    permission: z.enum(memberPermissionEnum.enumValues, { message: 'Invalid permission value' })
})

export const UpdateMemberPermissionSchema = z.object({
    permission: z.enum(memberPermissionEnum.enumValues, { message: 'Invalid permission value' })
})

export const WorkspaceMemberIdSchema = WorkspaceIdSchema.extend({
    memberId: z.uuid().nonempty({ message: 'Member ID is required' })
})
