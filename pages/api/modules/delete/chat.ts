import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {  
  if (req.method === 'DELETE') {
    const deleteChat = await prisma.chat.delete({
      where: {
        id: req.body.chatId
      }
    })
    res.status(200).json(deleteChat)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
