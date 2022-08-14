import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/Prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { email } = req.query

  const user = await prisma.user.findFirst({
    where: {
      email: String(email)
    },
    select: {
      id: true,
      name: true,
      location: true,
      username: true,
      email: true,
      image: true
    }
  })

  res.status(200).json(user)
}