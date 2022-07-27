import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../../../lib/Prisma'

export default async function handler(req: NextApiRequest,  res: NextApiResponse) {

  const session = await getSession({ req })

  if (!session) {
    res.status(401).json({ Error: 'UNAUTHENTICATED!' })
    return
  }

  if (req.method === 'POST') {
    const specificPost = await prisma.post.findFirst({
      where: {
        id: req.body.postId
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
        bookmarks: {
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
        _count: {
          select: {
            comments: true
          }
        },
        user: {
          select: {
            id: true,
            image: true,
            name: true
          }
        }
      }
    })
    res.status(200).json(specificPost)
  } else {
    res.status(500).json({ error: `Unauthorized` })
  }
}
