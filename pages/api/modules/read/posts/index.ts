import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/Prisma'

export default async function handler(req: NextApiRequest,  res: NextApiResponse) {
  const limit = 5
  const cursor = req.query.cursor ?? ''
  const cursorObj = cursor === '' ? undefined : { id: String(cursor) }

  const posts = await prisma.post.findMany({
    where: {
      userId: req.body.userId
    },
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
    posts,
    nextId:  posts.length === limit ? posts[limit - 1].id : undefined
  })
}
