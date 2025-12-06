import { CreateWorkspaceMember, WorkspaceMember } from '@/core'
import { DatabaseError, ForbiddenError } from '@/util'

import { MemberDTO, UpdateMemberPermissionInput } from './member.types'
import { IMemberRepository } from './member.repository'

type MemberMap = {
    id: string
    userId: string
    permission: 'FULL_ACCESS' | 'VIEW_ONLY' | 'COMMENT_ONLY' | 'EDIT'
    firstName: string | null
    lastName: string | null
    email: string
    avatarUrl: string | null
}

export interface IMemberService {
    getWorkspaceMembers(workspaceId: string): Promise<MemberDTO[]>
    getMemberByWorkspaceId(workspaceId: string): Promise<WorkspaceMember[]>
    getMemberWithDetails(workspaceId: string): Promise<MemberMap[]>
    insertMemberToWorkspace(data: CreateWorkspaceMember): Promise<MemberDTO>
    updateMemberPermission(
        workspaceId: string,
        memberId: string,
        requesterId: string,
        data: UpdateMemberPermissionInput
    ): Promise<MemberDTO>
    removeMemberFromWorkspace(
        workspaceId: string,
        memberId: string,
        requesterId: string
    ): Promise<{ message: string }>
}

export class MemberService implements IMemberService {
    constructor(private readonly memberRepository: IMemberRepository) {}

    async getWorkspaceMembers(workspaceId: string): Promise<MemberDTO[]> {
        const members = await this.memberRepository.getWorkspaceMembers(workspaceId)

        return members
    }

    async getMemberByWorkspaceId(workspaceId: string): Promise<WorkspaceMember[]> {
        const members = await this.memberRepository.getMemberByWorkspaceId(workspaceId)

        if (!members) {
            throw new DatabaseError(
                'Failed to retrieve members.',
                'MemberService.getMemberByWorkspaceId'
            )
        }

        return members
    }

    async getMemberWithDetails(workspaceId: string): Promise<MemberMap[]> {
        const members = await this.memberRepository.getMemberWithDetails(workspaceId)
        if (!members) {
            throw new DatabaseError(
                'Failed to retrieve members with details.',
                'MemberService.getMemberWithDetails'
            )
        }
        return members
    }

    async insertMemberToWorkspace(data: CreateWorkspaceMember): Promise<MemberDTO> {
        const newMember = await this.memberRepository.addMemberByWorkspaceId(data)

        if (!newMember) {
            throw new DatabaseError(
                'Failed to insert new member record.',
                'MemberService.insertMemberToWorkspace'
            )
        }

        return newMember
    }

    async updateMemberPermission(
        workspaceId: string,
        memberId: string,
        requesterId: string,
        data: UpdateMemberPermissionInput
    ): Promise<MemberDTO> {
        const [requesterPermissionResult, targetMemberAndWorkspaceDetails] = await Promise.all([
            this.memberRepository.getPermissionByWorkspaceAndUser(workspaceId, requesterId),
            this.memberRepository.getMemberDetailsWithOwner(workspaceId, memberId)
        ])

        // 1. Verify requester is a member with FULL_ACCESS
        if (!requesterPermissionResult || requesterPermissionResult.permission !== 'FULL_ACCESS') {
            throw new ForbiddenError('Not a member of the workspace or insufficient permissions.')
        }

        // 2. Verify target member belongs to the workspace
        if (
            !targetMemberAndWorkspaceDetails ||
            targetMemberAndWorkspaceDetails.workspace.id !== workspaceId
        ) {
            throw new ForbiddenError('Member does not belong to the specified workspace.')
        }

        // 2. Prevent changing owner's permission
        if (
            targetMemberAndWorkspaceDetails.member.userId ===
            targetMemberAndWorkspaceDetails.workspace.ownerId
        ) {
            throw new ForbiddenError('Cannot change permission of the workspace owner.')
        }

        const updatedMember = await this.memberRepository.changeMemberPermission(
            memberId,
            data.permission
        )

        if (!updatedMember) {
            throw new DatabaseError(
                'Failed to update member permission.',
                'MemberService.updateMemberPermission'
            )
        }

        return updatedMember
    }

    async removeMemberFromWorkspace(workspaceId: string, memberId: string, requesterId: string) {
        const [requesterPermissionResult, targetMemberAndWorkspaceDetails] = await Promise.all([
            this.memberRepository.getPermissionByWorkspaceAndUser(workspaceId, requesterId),
            this.memberRepository.getMemberDetailsWithOwner(workspaceId, memberId)
        ])

        // 1. Verify requester is a member
        if (!requesterPermissionResult || requesterPermissionResult.permission !== 'FULL_ACCESS') {
            throw new ForbiddenError('Not a member of the workspace or insufficient permissions.')
        }

        if (
            !targetMemberAndWorkspaceDetails ||
            targetMemberAndWorkspaceDetails.workspace.id !== workspaceId
        ) {
            throw new ForbiddenError('Target member does not belong to the specified workspace.')
        }

        // 2. Prevent removing owner
        if (
            targetMemberAndWorkspaceDetails.member.userId ===
            targetMemberAndWorkspaceDetails.workspace.ownerId
        ) {
            throw new ForbiddenError('Cannot remove workspace owner.')
        }

        const removedMember = await this.memberRepository.removeMemberById(memberId)

        if (!removedMember) {
            throw new DatabaseError(
                'Failed to remove member from workspace.',
                'MemberService.removeMemberFromWorkspace'
            )
        }

        return { message: 'Member removed successfully.' }
    }
}
