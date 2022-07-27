import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {  
  if (req.method === 'DELETE') {
    const deleteRoom = await prisma.room.delete({
      where: {
        id: req.body.roomId
      }
    })
    res.status(200).json(deleteRoom)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
