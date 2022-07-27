import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../../lib/Prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const session = await getSession({ req })

  if (!session) {
    res.status(401).json({ Error: 'UNAUTHENTICATED!' })
    return
  }

  const { email } = req.query

  const user = await prisma.user.findFirst({
    where: {
      email: String(email)
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      image: true
    }
  })

  res.status(200).json(user)
}