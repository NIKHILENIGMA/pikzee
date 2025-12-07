import { DatabaseError, ForbiddenError, NotFoundError } from '@/util'

import {
    CreateMemberDTO,
    MemberDTO,
    UpdateMemberDTO,
    UpdateMemberPermissionDTO
} from './member.types'
import { IMemberRepository } from './member.repository'

export interface IMemberService {
    create(data: CreateMemberDTO): Promise<MemberDTO>
    update(memberId: string, data: UpdateMemberDTO): Promise<MemberDTO>
    updatePermission(data: UpdateMemberPermissionDTO): Promise<MemberDTO>
    delete(workspaceId: string, memberId: string): Promise<MemberDTO>
    kickMember(workspaceId: string, memberId: string): Promise<MemberDTO>
    getById(memberId: string): Promise<MemberDTO>
    listAll(): Promise<MemberDTO[]>
}

export class MemberService implements IMemberService {
    constructor(private readonly memberRepository: IMemberRepository) {}

    async create(data: CreateMemberDTO): Promise<MemberDTO> {
        const newMember = await this.memberRepository.create(data)

        if (!newMember) {
            throw new DatabaseError('Failed to create new member', 'MEMBER_CREATION_FAILED')
        }
        return newMember
    }

    async update(memberId: string, data: UpdateMemberDTO): Promise<MemberDTO> {
        const updatedMember = await this.memberRepository.update(memberId, data)
        if (updatedMember.length === 0) {
            throw new NotFoundError('Member not found', 'MEMBER_NOT_FOUND')
        }
        return updatedMember[0]
    }

    async updatePermission(data: UpdateMemberPermissionDTO): Promise<MemberDTO> {
        const updatedMember = await this.memberRepository.updatePermission(data)

        if (updatedMember.length === 0) {
            const member = await this.memberRepository.getById(data.memberId)
            if (!member) {
                throw new NotFoundError('Member not found', 'MEMBER_NOT_FOUND')
            }

            throw new ForbiddenError(
                'Only workspace owners can update member permissions',
                'MEMBER_UPDATE_FAILED'
            )
        }

        return updatedMember[0]
    }

    async delete(workspaceId: string, memberId: string): Promise<MemberDTO> {
        const deletedMember = await this.memberRepository.delete({ workspaceId, memberId })

        if (!deletedMember) {
            throw new NotFoundError('Member not found', 'MEMBER_NOT_FOUND')
        }
        return deletedMember
    }

    async kickMember(workspaceId: string, memberId: string): Promise<MemberDTO> {
        const deletedMember = await this.memberRepository.delete({ workspaceId, memberId })

        if (!deletedMember) {
            throw new NotFoundError('Member not found', 'MEMBER_NOT_FOUND')
        }

        return deletedMember
    }

    // --------------------------------------------
    // Query Methods
    // --------------------------------------------

    async getById(memberId: string): Promise<MemberDTO> {
        const member = await this.memberRepository.getById(memberId)

        if (!member) {
            throw new NotFoundError('Member not found', 'MEMBER_NOT_FOUND')
        }

        return member
    }

    async listAll(): Promise<MemberDTO[]> {
        const members = await this.memberRepository.listAll()
        return members
    }
}
