import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {

  const session = await getSession({ req })

  if (!session) {
    res.status(401).json({ Error: 'UNAUTHENTICATED!' })
    return
  }

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
