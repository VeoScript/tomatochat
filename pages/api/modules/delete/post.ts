import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {  
  if (req.method === 'DELETE') {
    const deletePost = await prisma.post.delete({
      where: {
        id: req.body.postId
      }
    })
    res.status(200).json(deletePost)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
