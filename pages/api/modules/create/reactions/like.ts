import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const likePost = await prisma.like.create({
      data: {
        postId: req.body.postId,
        userId: req.body.userId
      }
    })
    res.status(200).json(likePost)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
