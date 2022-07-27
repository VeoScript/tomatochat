import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const updateProfilePhoto = await prisma.user.update({
      where: {
        id: req.body.userId
      },
      data: {
        image: req.body.photo
      }
    })
    res.status(200).json(updateProfilePhoto)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
