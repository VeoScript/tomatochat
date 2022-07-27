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
    const lastChat = await prisma.joinedRoom.updateMany({
      where: {
        roomSlug: req.body.roomSlug
      },
      data: {
        seen: false,
        lastChat: req.body.lastChat,
        lastChatType: req.body.lastChatType,
        lastSentUserId: req.body.lastSendUserId,
        lastSentUserImage: req.body.lastSentUserImage,
        lastSentUserName: req.body.lastSentUserName,
        lastSentDate: String(date)
      }
    })
    res.status(200).json(lastChat)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
