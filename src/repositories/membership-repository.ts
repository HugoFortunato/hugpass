import { Membership, Prisma } from '@prisma/client'

export interface MembershipsRepository {
  findByUserId(userId: string): Promise<Membership | null>
  create(data: Prisma.MembershipUncheckedCreateInput): Promise<Membership>
}
