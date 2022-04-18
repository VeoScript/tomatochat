import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  const date = new Date()
  const joinRoom = await prisma.joinedRoom.create({
    data: {
      date: String(date),
      roomSlug: req.body.slug,
      userId: req.body.userId,
    }
  })
  res.status(200).json(joinRoom)
}
