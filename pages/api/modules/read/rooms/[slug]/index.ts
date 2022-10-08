import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session) {
    res.status(401).json({ Error: 'UNAUTHENTICATED!' })
    return
  }
  
  const { slug } = req.query

  const room = await prisma.room.findFirst({
    where: {
      slug: String(slug),
    },
    select: {
      id: true,
      index: true,
      photo: true,
      name: true,
      description: true,
      privacy: true,
      slug: true,
      userId: true
    }
  })
  res.status(200).json(room)
}
