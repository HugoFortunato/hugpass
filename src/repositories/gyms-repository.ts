import { Gym, Prisma } from '@prisma/client'

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export interface PickSuggestedGymsParams {
  isPrivateClassesAllowed: boolean
  userLatitude: number
  userLongitude: number
}

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  searchMany(query: string, page: number): Promise<Gym[]>
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>
  pickSuggestedGyms(params: PickSuggestedGymsParams): Promise<Gym[]>
  create(data: Prisma.GymCreateInput): Promise<Gym>
}
