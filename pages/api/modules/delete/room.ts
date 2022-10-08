import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {  
  const session = await getSession({ req })

  if (!session) {
    res.status(401).json({ Error: 'UNAUTHENTICATED!' })
    return
  }
  
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
