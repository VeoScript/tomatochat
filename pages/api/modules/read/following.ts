import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/Prisma'

export default async function handler(req: NextApiRequest,  res: NextApiResponse) {
  const limit = 10
  const cursor = req.query.cursor ?? ''
  const cursorObj = cursor === '' ? undefined : { id: String(cursor) }

  const following = await prisma.user.findFirst({
    where: {
      id: req.body.profileId
    },
    select: {
      id: true,
      following: {
        select: {
          id: true,
          createdAt: true,
          follower: {
            select: {
              id: true,
              image: true,
              name: true,
              location: true,
              followers: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        cursor: cursorObj,
        skip: cursor === '' ? 0 : 1
      }
    }
  })

  res.status(200).json({
    following,
    nextId:  following?.following.length === limit ? following.following[limit - 1].id : undefined
  })
}
