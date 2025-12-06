import { eq } from 'drizzle-orm'

import { type CreateInvitation, type Invitation, invitations } from '@/core'
import { DatabaseConnection } from '@/core/db/service/database.service'

export interface IInvitationRepository {
    create(data: CreateInvitation): Promise<Invitation>
    update(id: string, data: Partial<Invitation>): Promise<Invitation>
    delete(id: string): Promise<Invitation>
    getById(id: string): Promise<Invitation | null>
    getByToken(token: string): Promise<Invitation | null>
    getByEmail(email: string): Promise<Invitation | null>
    listAll(): Promise<Invitation[]>
}

export class InvitationRepository implements IInvitationRepository {
    constructor(private db: DatabaseConnection) {}

    async create(data: CreateInvitation): Promise<Invitation> {
        const newInvitation = await this.db.insert(invitations).values(data).returning()

        return newInvitation[0]
    }

    async update(id: string, data: Partial<Invitation>): Promise<Invitation> {
        const [updatedInvitation] = await this.db
            .update(invitations)
            .set(data)
            .where(eq(invitations.id, id))
            .returning()

        return updatedInvitation
    }

    async delete(id: string): Promise<Invitation> {
        const [deletedInvitation] = await this.db
            .delete(invitations)
            .where(eq(invitations.id, id))
            .returning()

        return deletedInvitation
    }

    async getById(id: string): Promise<Invitation | null> {
        const [invitation] = await this.db.select().from(invitations).where(eq(invitations.id, id))

        if (!invitation) return null

        return invitation
    }

    async getByToken(token: string): Promise<Invitation | null> {
        const [invitation] = await this.db
            .select()
            .from(invitations)
            .where(eq(invitations.token, token))

        if (!invitation) return null

        return invitation
    }

    async getByEmail(email: string): Promise<Invitation | null> {
        const [invitation] = await this.db
            .select()
            .from(invitations)
            .where(eq(invitations.inviteeEmail, email))

        if (!invitation) return null

        return invitation
    }

    async listAll(): Promise<Invitation[]> {
        const allInvitations = await this.db.select().from(invitations)

        return allInvitations
    }
}
