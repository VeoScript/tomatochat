import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {  
  if (req.method === 'DELETE') {
    const deleteBookmark = await prisma.bookmark.deleteMany({
      where: {
        postId: req.body.postId,
        userId: req.body.userId
      }
    })
    res.status(200).json(deleteBookmark)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
