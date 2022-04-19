import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/Prisma'
import bcrypt from 'bcryptjs'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  const date = new Date()

  const rawPassword = req.body.password

  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(rawPassword, salt)
  
  await prisma.room.create({
    data: {
      date: String(date),
      photo: req.body.photo,
      name: req.body.name,
      slug: req.body.name.replace(/\s+/g, '-').toLowerCase(),
      privacy: req.body.privacy,
      description: req.body.description,
      password: hashedPassword,
      userId: req.body.userId
    }
  })

  await prisma.joinedRoom.create({
    data: {
      role: 'ADMIN',
      date: String(date),
      userId: req.body.userId,
      roomSlug: req.body.name.replace(/\s+/g, '-').toLowerCase()
    }
  })

  res.status(200).json({ message: 'Created Successfully...' })
}
