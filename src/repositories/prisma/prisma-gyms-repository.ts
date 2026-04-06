import { prisma } from '@/lib/prisma'
import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
// import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    return gym
  }

  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    return gyms
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    // isso aqui não é o melhor jeito de fazer isso, mas é o jeito mais simples de fazer isso.
    // const gyms = await prisma.gym.findMany({
    //   select: {
    //     id: true,
    //     title: true,
    //     description: true,
    //     phone: true,
    //     latitude: true,
    //     longitude: true,
    //   },
    // })
    // const nearbyGyms = gyms.filter((gym) => {
    //   const distance = getDistanceBetweenCoordinates(
    //     {
    //       latitude: params.latitude,
    //       longitude: params.longitude,
    //     },
    //     {
    //       latitude: gym.latitude.toNumber(),
    //       longitude: gym.longitude.toNumber(),
    //     },
    //   )
    //   return distance < 10
    // })
    // return nearbyGyms

    // isso aqui é o melhor jeito de fazer isso, escrevendo uma query SQL diretamente no prisma.

    const gyms = await prisma.$queryRaw<Gym[]>`
     SELECT * from gyms
     WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return gyms
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }
}
