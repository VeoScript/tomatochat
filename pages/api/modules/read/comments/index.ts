import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/Prisma'

export default async function handler(req: NextApiRequest,  res: NextApiResponse) {
  const limit = 10
  const cursor = req.query.cursor ?? ''
  const cursorObj = cursor === '' ? undefined : { id: String(cursor) }

  const comments = await prisma.comment.findMany({
    where: {
      postId: req.body.postId
    },
    select: {
      id: true,
      index: true,
      message: true,
      createdAt: true,
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
    comments,
    nextId:  comments.length === limit ? comments[limit - 1].id : undefined
  })
}
