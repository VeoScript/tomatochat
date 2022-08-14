import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  const userprofile = await prisma.user.findFirst({
    where: {
      id: req.body.userId
    },
    select: {
      id: true,
      image: true,
      coverImage: true,
      name: true,
      email: true,
      username: true,
      location: true,
      followers: true,
      following: true,
      bio: true,
      facebook: true,
      instagram: true,
      linkedin: true,
      twitter: true,
      tiktok: true,
      youtube: true,
      hobbies: {
        select: {
          id: true,
          name: true
        }
      },
      accounts: {
        select: {
          provider: true
        }
      }
    },
  })
  res.status(200).json(userprofile)
}
