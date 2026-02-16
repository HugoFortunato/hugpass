import { expect, describe, it } from 'vitest'
import { MembershipUseCase } from './membership'
import { InMemoryMembershipRepository } from '@/repositories/in-memory/in-memory-membership-repository'

describe('Membership Use Case', () => {
  it('should has create a membership', async () => {
    const membershipRepository = new InMemoryMembershipRepository()
    const membershipUseCase = new MembershipUseCase(membershipRepository)

    const { user } = await membershipUseCase.execute({
      userId: 'user-1',
      plan: 'MONTHLY',
    })

    expect(user.id).toEqual('user-1')
  })

  it('should verify if user already has a membership', async () => {
    const membershipRepository = new InMemoryMembershipRepository()
    const membershipUseCase = new MembershipUseCase(membershipRepository)

    const { user } = await membershipUseCase.execute({
      userId: 'user-2',
      plan: 'YEARLY',
    })

    expect(user.active).toBe(true)

    expect(() =>
      membershipUseCase.execute({
        userId: 'user-2',
        plan: 'YEARLY',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
