import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  const createRoom = await prisma.room.create({
    data: {
      photo: req.body.photo,
      name: req.body.name,
      privacy: req.body.privacy,
      description: req.body.description,
      password: req.body.password,
      userId: req.body.userId
    }
  })
  res.status(200).json(createRoom)
}
