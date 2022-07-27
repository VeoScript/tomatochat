import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from '@prisma/client'
import prisma from '../../../../lib/Prisma'
import bcrypt from 'bcryptjs'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const date = new Date()

      const privacy = req.body.privacy
      const rawPassword = req.body.password

      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(rawPassword, salt)
      
      await prisma.room.create({
        data: {
          date: String(date),
          photo: req.body.photo,
          name: req.body.name,
          slug: req.body.uuidSlug,
          privacy: privacy,
          description: req.body.description,
          password: privacy === 'Private' ? hashedPassword : null,
          userId: req.body.userId
        }
      })

      await prisma.joinedRoom.create({
        data: {
          role: 'ADMIN',
          date: String(date),
          userId: req.body.userId,
          lastSentUserId: req.body.userId,
          roomSlug: req.body.uuidSlug
        }
      })

      res.status(200).json({ message: 'Created Successfully...' })
    } else {
      res.status(500).json({ error: `Unauthorized` })
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.status(500).json({
          message: `Name is already existed, a new room cannot be created using this name.`
        })
      }
    }
    throw error
  }
}
