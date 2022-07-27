import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const createStory = await prisma.story.create({
      data: {
        image: req.body.imageUrl,
        postId: req.body.postId
      }
    })
    res.status(200).json(createStory)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
