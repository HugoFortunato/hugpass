import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

// findById(id: string): Promise<Gym | null>
//   searchMany(query: string, page: number): Promise<Gym[]>
//   findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>
//   create(data: Prisma.GymCreateInput): Promise<Gym>

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

  async findManyNearby(params: FindManyNearbyParams) {
    const gyms = await prisma.gym.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        phone: true,
        latitude: true,
        longitude: true,
      },
    })

    const nearbyGyms = gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      )

      return distance < 10
    })

    return nearbyGyms
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }

  //   async findByUserIdOnDate(userId: string, date: Date) {
  //     const startOfTheDay = dayjs(date).startOf('date')
  //     const endOfTheDay = dayjs(date).endOf('date')

  //     const checkIn = await prisma.checkIn.findFirst({
  //       where: {
  //         user_id: userId,
  //         created_at: {
  //           gte: startOfTheDay.toDate(),
  //           lte: endOfTheDay.toDate(),
  //         },
  //       },
  //     })

  //     return checkIn
  //   }

  //   async findManyByUserId(userId: string, page: number) {
  //     const checkIns = await prisma.checkIn.findMany({
  //       where: {
  //         user_id: userId,
  //       },
  //       skip: (page - 1) * 20,
  //       take: 20,
  //     })

  //     return checkIns
  //   }

  //   async countByUserId(userId: string) {
  //     const count = await prisma.checkIn.count({
  //       where: {
  //         user_id: userId,
  //       },
  //     })

  //     return count
  //   }

  //   async create(data: Prisma.CheckInUncheckedCreateInput) {
  //     const checkIn = await prisma.checkIn.create({
  //       data,
  //     })

  //     return checkIn
  //   }

  //   async save(data: CheckIn) {
  //     const checkIn = await prisma.checkIn.update({
  //       where: {
  //         id: data.id,
  //       },
  //       data,
  //     })

  //     return checkIn
  //   }
}
