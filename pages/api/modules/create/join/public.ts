import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const date = new Date()
    const joinRoomPublic = await prisma.joinedRoom.create({
      data: {
        role: 'USER',
        date: String(date),
        roomSlug: req.body.slug,
        lastSentUserId: req.body.userId,
        userId: req.body.userId,
      }
    })
    res.status(200).json(joinRoomPublic)
  } else {
    res.status(500).json({ error: 'Unauthorized' })
  }
}
