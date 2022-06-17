import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const follow = await prisma.follows.create({
      data: {
        followerId: req.body.profileId,
        followingId: req.body.userId
      }
    })
    res.status(200).json(follow)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
