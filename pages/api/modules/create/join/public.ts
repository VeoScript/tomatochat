import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {

  const session = await getSession({ req })

  if (!session) {
    res.status(401).json({ Error: 'UNAUTHENTICATED!' })
    return
  }

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
