import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query

  const joinRoom = await prisma.room.findFirst({
    where: {
      slug: String(slug)
    },
    select: {
      id: true,
      index: true,
      photo: true,
      name: true,
      description: true,
      privacy: true,
      slug: true,
      joinedroom: {
        select: {
          role: true,
          user: {
            select: {
              id: true,
              image: true,
              name: true
            }
          }
        }
      }
    }
  })
  
  res.status(200).json(joinRoom)
}
