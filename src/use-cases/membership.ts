import { MembershipsRepository } from '@/repositories/membership-repository'
import { UserAlreadyExistsError } from './errors/use-already-exists-error'

interface MembershipUseCaseRequest {
  userId: string
  plan: string
}

interface MembershipUseCaseResponse {}

export class MembershipUseCase {
  constructor(private membershipRepository: MembershipsRepository) {}

  async execute({
    plan,
    userId,
  }: MembershipUseCaseRequest): Promise<MembershipUseCaseResponse> {
    let duration = 0

    const userHasMembership =
      await this.membershipRepository.findByUserId(userId)

    if (userHasMembership) {
      console.log('caiu aqui')
      throw new UserAlreadyExistsError()
    }

    if (plan === 'YEARLY') duration = 365
    if (plan === 'MONTHLY') duration = 30

    const startDate = new Date()

    const endDate = new Date(
      startDate.getTime() + duration * 24 * 60 * 60 * 1000,
    )

    const user = await this.membershipRepository.create({
      id: userId,
      user_id: userId,
      start_date: startDate,
      end_date: endDate,
      active: true,
    })

    return {
      user,
    }
  }
}
