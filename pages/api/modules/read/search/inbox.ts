import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/Prisma'

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  const searchInbox = await prisma.joinedRoom.findMany({
    orderBy: {
      room: {
        name: 'asc'
      }
    },
    where: {
      user: {
        id: req.body.userId
      },
      room: {
        name: {
          startsWith: req.body.searchTerm
        }
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
    }
  })
  res.status(200).json(searchInbox)
}
