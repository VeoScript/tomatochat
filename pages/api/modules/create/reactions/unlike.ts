import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const unlikePost = await prisma.like.deleteMany({
      where: {
        postId: req.body.postId,
        userId: req.body.userId
      }
    })
    res.status(200).json(unlikePost)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
