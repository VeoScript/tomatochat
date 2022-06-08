import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const createPost = await prisma.post.create({
      data: {
        id: req.body.postId,
        description: req.body.description,
        userId: req.body.userId
      }
    })
    res.status(200).json(createPost)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
