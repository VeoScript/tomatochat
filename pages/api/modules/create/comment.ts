import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const commmentPost = await prisma.comment.create({
      data: {
        message: req.body.message,
        postId: req.body.postId,
        userId: req.body.userId
      }
    })
    res.status(200).json(commmentPost)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
