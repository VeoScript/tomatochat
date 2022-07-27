import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {  
  if (req.method === 'PUT') {
    const updateUserIntro = await prisma.user.update({
      where: {
        id: req.body.userId
      },
      data: {
        bio: req.body.bio
      }
    })
    res.status(200).json(updateUserIntro)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
