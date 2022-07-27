import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const date = new Date()
    const createChatImage = await prisma.chat.create({
      data: {
        date: String(date),
        chattype: 'IMAGE',
        message: req.body.chatbox,
        roomSlug: req.body.roomSlug,
        userId: req.body.userId
      }
    })
    res.status(200).json(createChatImage)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
