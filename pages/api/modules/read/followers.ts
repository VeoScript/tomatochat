import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../../lib/Prisma'

export default async function handler(req: NextApiRequest,  res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session) {
    res.status(401).json({ Error: 'UNAUTHENTICATED!' })
    return
  }
  
  const limit = 10
  const cursor = req.query.cursor ?? ''
  const cursorObj = cursor === '' ? undefined : { id: String(cursor) }

  const followers = await prisma.user.findFirst({
    where: {
      id: req.body.profileId
    },
    select: {
      id: true,
      followers: {
        select: {
          id: true,
          createdAt: true,
          following: {
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
    followers,
    nextId:  followers?.followers.length === limit ? followers.followers[limit - 1].id : undefined
  })
}
