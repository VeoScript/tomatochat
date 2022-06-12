import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/Prisma'

export default async function handler(req: NextApiRequest,  res: NextApiResponse) {
  const limit = 5
  const cursor = req.query.cursor ?? ''
  const cursorObj = cursor === '' ? undefined : { id: String(cursor) }

  const newsfeed = await prisma.post.findMany({
    select: {
      id: true,
      index: true,
      description: true,
      createdAt: true,
      stories: {
        select: {
          id: true,
          image: true,
          postId: true
        }
      },
      likes: {
        select: {
          postId: true,
          userId: true,
          user: {
            select: {
              name: true
            }
          }
        }
      },
      user: {
        select: {
          id: true,
          image: true,
          name: true
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
    newsfeed,
    nextId:  newsfeed.length === limit ? newsfeed[limit - 1].id : undefined
  })
}
