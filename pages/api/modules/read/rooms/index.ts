import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../../../lib/Prisma'

export default async function handler(req: NextApiRequest,  res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session) {
    res.status(401).json({ Error: 'UNAUTHENTICATED!' })
    return
  }
  
  const limit = 5
  const cursor = req.query.cursor ?? ''
  const cursorObj = cursor === '' ? undefined : { id: String(cursor) }

  const rooms = await prisma.room.findMany({
    select: {
      id: true,
      index: true,
      photo: true,
      name: true,
      slug: true,
      description: true,
      privacy: true,
      userId: true,
      joinedroom: {
        select: {
          userId: true
        }
      }
    },
    orderBy: {
      index: 'desc'
    },
    take: limit,
    cursor: cursorObj,
    skip: cursor === '' ? 0 : 1
  })

  res.status(200).json({
    rooms,
    nextId:  rooms.length === limit ? rooms[limit - 1].id : undefined
  })
}
