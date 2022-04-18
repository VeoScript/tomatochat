import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/Prisma'

export default async function handler(req: NextApiRequest,  res: NextApiResponse) {
  const limit = 10
  const cursor = req.query.cursor ?? ''
  const cursorObj = cursor === '' ? undefined : { id: String(cursor) }

  const chats = await prisma.chat.findMany({
    where: {
      roomSlug: req.body.roomSlug
    },
    select: {
      id: true,
      index: true,
      message: true,
      date: true,
      roomSlug: true,
      userId: true,
      user: {
        select: {
          id: true,
          image: true,
          email: true,
          name: true,
          username: true
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
    chats,
    nextId:  chats.length === limit ? chats[limit - 1].id : undefined
  })
}
