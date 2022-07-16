import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {  
  if (req.method === 'DELETE') {
    const deleteHobby = await prisma.hobbies.delete({
      where: {
        id: req.body.hobbyId
      }
    })
    res.status(200).json(deleteHobby)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
