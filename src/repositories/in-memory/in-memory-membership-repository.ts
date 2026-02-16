import { Prisma, Membership } from '@prisma/client'
import { MembershipsRepository } from '../membership-repository'

export class InMemoryMembershipRepository implements MembershipsRepository {
  public items: Membership[] = []

  async findByUserId(userId: string) {
    const user = this.items.find((item) => item.id === userId)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: Prisma.MembershipUncheckedCreateInput) {
    const user = {
      id: data.id ?? `membership-${Math.random()}`,
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
      active: data.active ?? true,
      user_id: data.user_id,
    }

    this.items.push(user)

    return user
  }
}
