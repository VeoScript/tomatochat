import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from '@prisma/client'
import prisma from '../../../../lib/Prisma'
import bcrypt from 'bcryptjs'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const date = new Date()

      let passcodeDecide

      const privacy = req.body.privacy
      const rawPassword = req.body.password

      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(rawPassword, salt)

      const getDefaultPassword = await prisma.room.findFirst({
        where: {
          slug: req.body.roomSlug
        },
        select: {
          password: true
        }
      })

      if (privacy === 'Private' && rawPassword !== '') {
        passcodeDecide = hashedPassword // kung ang privacy is private ug nag update sya sa ija passcode - (return to created hash password)...
      } else if (privacy === 'Private' && rawPassword === '') {
        passcodeDecide = getDefaultPassword?.password // kung ang privacy is private pero wala siya nag update sa ija passcode - (return to default password)...
      } else {
        passcodeDecide = null // kung ang privacy is public - (return password to null)...
      }
      
      await prisma.room.update({
        where: {
          slug: req.body.roomSlug
        },
        data: {
          date: String(date),
          photo: req.body.photo,
          name: req.body.name,
          slug: req.body.uuidSlug,
          privacy: privacy,
          description: req.body.description,
          password: passcodeDecide,
          userId: req.body.userId
        }
      })

      res.status(200).json({ message: 'Updated Successfully...' })
    } else {
      res.status(500).json({ error: `Unauthorized` })
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.status(500).json({
          message: `Name is already existed, room cannot be updated using this name.`
        })
      }
    }
    throw error
  }
}
