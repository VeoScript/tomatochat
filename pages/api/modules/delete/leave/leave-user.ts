import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const leaveUser = await prisma.joinedRoom.delete({
      where: {
        id: req.body.joinedRoomId
      }
    })
    res.status(200).json(leaveUser)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
