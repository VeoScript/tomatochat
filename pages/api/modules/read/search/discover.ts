import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  const searchDiscover = await prisma.room.findMany({
    orderBy: {
      name: 'asc'
    },
    where: {
      name: {
        contains: `${req.body.searchTerm}`
      }
    },
    select: {
      id: true,
      index: true,
      photo: true,
      name: true,
      slug: true,
      description: true,
      privacy: true,
      userId: true,
      joinedroom: {
        select: {
          userId: true
        }
      }
    },
  })
  res.status(200).json(searchDiscover)
}
