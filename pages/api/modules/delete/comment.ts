import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {  
  if (req.method === 'DELETE') {
    const deleteComment = await prisma.comment.delete({
      where: {
        id: req.body.commentId
      }
    })
    res.status(200).json(deleteComment)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
