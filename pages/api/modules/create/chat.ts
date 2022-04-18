import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  const date = new Date()
  const createChat = await prisma.chat.create({
    data: {
      date: String(date),
      message: req.body.chatbox,
      roomSlug: req.body.roomSlug,
      userId: req.body.userId
    }
  })
  res.status(200).json(createChat)
}
