import { MembershipsRepository } from '@/repositories/membership-repository'

import { Membership } from '@prisma/client'

import { NoActiveMembershipError } from './errors/no-active-membership-error'

interface GetActiveMembershipUseCaseRequest {
  userId: string
}

interface GetActiveMembershipUseCaseResponse {
  activeMembership: Membership
}

export class GetActiveMembershipUseCase {
  constructor(private membershipRepository: MembershipsRepository) {}

  async execute({
    userId,
  }: GetActiveMembershipUseCaseRequest): Promise<GetActiveMembershipUseCaseResponse> {
    const activeMembership =
      await this.membershipRepository.findActiveMembership(userId)

    if (!activeMembership) {
      throw new NoActiveMembershipError()
    }

    return {
      activeMembership,
    }
  }
}
