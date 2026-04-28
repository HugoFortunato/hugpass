import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { PickSuggestedGymsUseCase } from '../pick-suggested-gyms'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makePickSuggestedGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new PickSuggestedGymsUseCase(gymsRepository, usersRepository)

  return useCase
}
