import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) { 

  const session = await getSession({ req })

  if (!session) {
    res.status(401).json({ Error: 'UNAUTHENTICATED!' })
    return
  }
 
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
