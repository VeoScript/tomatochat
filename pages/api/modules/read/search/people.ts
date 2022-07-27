import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  const searchPeople = await prisma.user.findMany({
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
      image: true,
      name: true,
      username: true
    }
  })
  res.status(200).json(searchPeople)
}
