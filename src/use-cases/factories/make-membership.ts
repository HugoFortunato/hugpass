import { PrismaMembershipRepository } from '@/repositories/prisma/prisma-membership-repository'
import { MembershipUseCase } from '../membership'

export function makeMembershipUseCase() {
  const membershipRepository = new PrismaMembershipRepository()
  const useCase = new MembershipUseCase(membershipRepository)

  return useCase
}
