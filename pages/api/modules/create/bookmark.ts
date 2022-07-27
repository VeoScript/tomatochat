import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {

  const session = await getSession({ req })

  if (!session) {
    res.status(401).json({ Error: 'UNAUTHENTICATED!' })
    return
  }

  if (req.method === 'POST') {
    const addToBookmark = await prisma.bookmark.create({
      data: {
        postId: req.body.postId,
        userId: req.body.userId
      }
    })
    res.status(200).json(addToBookmark)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
