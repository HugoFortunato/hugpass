import { PrismaMembershipRepository } from '@/repositories/prisma/prisma-membership-repository'
import { GetActiveMembershipUseCase } from '../get-active-membership'

export function makeActiveMembershipUseCase() {
  const membershipRepository = new PrismaMembershipRepository()
  const useCase = new GetActiveMembershipUseCase(membershipRepository)

  return useCase
}
