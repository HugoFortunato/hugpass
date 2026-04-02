import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Coordenadas na região central de São Paulo (Av. Paulista e entorno).
 * Distâncias < ~7 km entre si para o filtro de 10 km do findManyNearby retornar todas num único teste.
 */
const gyms = [
  {
    title: 'Smart Fit Paulista',
    description: 'Unidade Av. Paulista',
    phone: '11987654321',
    latitude: -23.5614,
    longitude: -46.656,
  },
  {
    title: 'Bodytech Consolação',
    description: 'Perto da Consolação',
    phone: '11987654322',
    latitude: -23.5489,
    longitude: -46.6612,
  },
  {
    title: 'Blue Fit Paraíso',
    description: 'Bairro Paraíso',
    phone: '11987654323',
    latitude: -23.5751,
    longitude: -46.6438,
  },
  {
    title: 'Academia Bela Vista',
    description: 'Região da Bela Vista',
    phone: '11987654324',
    latitude: -23.5538,
    longitude: -46.6362,
  },
  {
    title: 'Gym Higienópolis',
    description: 'Perto do Mackenzie',
    phone: '11987654325',
    latitude: -23.5436,
    longitude: -46.6587,
  },
  {
    title: 'Fit Jardins',
    description: 'Alameda Santos',
    phone: '11987654326',
    latitude: -23.5678,
    longitude: -46.6645,
  },
  {
    title: 'Cross República',
    description: 'Centro / República',
    phone: '11987654327',
    latitude: -23.5453,
    longitude: -46.6441,
  },
  {
    title: 'Iron Liberdade',
    description: 'Bairro da Liberdade',
    phone: '11987654328',
    latitude: -23.5592,
    longitude: -46.6348,
  },
  {
    title: 'Power Vila Mariana',
    description: 'Perto do Paraíso',
    phone: '11987654329',
    latitude: -23.5812,
    longitude: -46.6499,
  },
  {
    title: 'Strong Vila Buarque',
    description: 'Higienópolis / Vila Buarque',
    phone: '11987654330',
    latitude: -23.5395,
    longitude: -46.6523,
  },
]

async function main() {
  await prisma.checkIn.deleteMany()
  await prisma.gym.deleteMany()

  await prisma.gym.createMany({ data: gyms })

  console.log(
    `Seed concluído: ${gyms.length} academias em SP (centro; boas para GET /gyms/nearby com lat/lng da Paulista).`,
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
