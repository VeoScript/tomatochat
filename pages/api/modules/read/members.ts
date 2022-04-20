import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  const members = await prisma.joinedRoom.findMany({
    where: {
      roomSlug: req.body.roomSlug,
    },
    select: {
      id: true,
      index: true,
      role: true,
      user: {
        select: {
          id: true,
          image: true,
          name: true,
          username: true,
          email: true
        }
      }
    }
  })
  res.status(200).json(members)
}
