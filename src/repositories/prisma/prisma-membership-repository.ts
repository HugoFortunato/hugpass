import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

import { MembershipsRepository } from '../membership-repository'

export class PrismaMembershipRepository implements MembershipsRepository {
  async findByUserId(userId: string) {
    const user = await prisma.membership.findUnique({
      where: {
        id: userId,
      },
    })

    return user
  }

  async create(data: Prisma.MembershipUncheckedCreateInput) {
    const user = await prisma.membership.create({
      data: {
        ...(data.id !== undefined ? { id: data.id } : {}),
        start_date: data.start_date,
        end_date: data.end_date,
        ...(data.active !== undefined ? { active: data.active } : {}),
        user: { connect: { id: data.user_id } },
      },
    })

    return user
  }
}
