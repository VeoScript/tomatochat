import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/Prisma'
import bcrypt from 'bcryptjs'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const date = new Date()

    const roomPasscode = await prisma.room.findFirst({
      where: {
        slug: req.body.slug
      },
      select: {
        id: true,
        password: true
      }
    })

    const passcode = req.body.passcode
    const hashedPasscode = String(roomPasscode?.password)

    const matchPasscode = await bcrypt.compare(passcode, hashedPasscode)

    if (!matchPasscode) {
      return res.status(401).json({ message: `Invalid passcode!` })
    }

    const joinRoomPrivate = await prisma.joinedRoom.create({
      data: {
        role: 'USER',
        date: String(date),
        roomSlug: req.body.slug,
        lastSentUserId: req.body.userId,
        userId: req.body.userId,
      }
    })

    res.status(200).json(joinRoomPrivate)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
