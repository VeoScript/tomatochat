import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {  
  if (req.method === 'PUT') {
    const updateMemberRole = await prisma.joinedRoom.update({
      where: {
        id: req.body.joinedRoomId
      },
      data: {
        role: req.body.role
      }
    })
    res.status(200).json(updateMemberRole)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
