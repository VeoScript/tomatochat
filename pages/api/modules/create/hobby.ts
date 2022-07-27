import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const addUserHobby = await prisma.hobbies.create({
      data: {
        name: req.body.hobbyName,
        userId: req.body.userId
      }
    })
    res.status(200).json(addUserHobby)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
