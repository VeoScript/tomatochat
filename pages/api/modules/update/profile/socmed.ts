import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {  
  if (req.method === 'PUT') {
    const updateUserSocMeds = await prisma.user.update({
      where: {
        id: req.body.userId
      },
      data: {
        facebook: req.body.facebook,
        instagram: req.body.instagram,
        twitter: req.body.twitter,
        tiktok: req.body.tiktok,
        linkedin: req.body.linkedin,
        youtube: req.body.youtube
      }
    })
    res.status(200).json(updateUserSocMeds)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
