import { Gym } from '@prisma/client'

import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UsersRepository } from '@/repositories/users-repository'

interface PickSuggestedGymsUseCaseRequest {
  userId: string
  isPrivateClassesAllowed: boolean
  userLatitude: number
  userLongitude: number
}

interface PickSuggestedGymsUseCaseResponse {
  gyms: Gym[]
}

export class PickSuggestedGymsUseCase {
  constructor(
    private gymsRepository: GymsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userLatitude,
    userLongitude,
    userId,
    isPrivateClassesAllowed,
  }: PickSuggestedGymsUseCaseRequest): Promise<PickSuggestedGymsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const gyms = await this.gymsRepository.pickSuggestedGyms({
      isPrivateClassesAllowed,
      userLatitude,
      userLongitude,
    })

    return {
      gyms,
    }
  }
}
