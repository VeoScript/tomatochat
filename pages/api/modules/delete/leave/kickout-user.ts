import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const kickOutUser = await prisma.joinedRoom.deleteMany({
      where: {
        id: req.body.joinedRoomId,
        userId: req.body.userId
      }
    })
    res.status(200).json(kickOutUser)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
