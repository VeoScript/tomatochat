import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../../../lib/Prisma'

export default async function handler(req: NextApiRequest,  res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session) {
    res.status(401).json({ Error: 'UNAUTHENTICATED!' })
    return
  }
  
  const limit = 10
  const cursor = req.query.cursor ?? ''
  const cursorObj = cursor === '' ? undefined : { id: String(cursor) }

  const joined_rooms = await prisma.joinedRoom.findMany({
    where: {
      user: {
        id: req.body.userId
      }
    },
    select: {
      id: true,
      index: true,
      userId: true,
      seen: true,
      lastChat: true,
      lastChatType: true,
      lastSentUserName: true,
      lastSentDate: true,
      room: {
        select: {
          id: true,
          index: true,
          photo: true,
          name: true,
          slug: true,
          description: true,
          privacy: true,
          chats: {
            select: {
              id: true,
              roomSlug: true,
              userId: true
            }
          }
        }
      }
    },
    orderBy: {
      lastSentDate: 'desc'
    },
    take: limit,
    cursor: cursorObj,
    skip: cursor === '' ? 0 : 1
  })

  res.status(200).json({
    joined_rooms,
    nextId:  joined_rooms.length === limit ? joined_rooms[limit - 1].id : undefined
  })
}
