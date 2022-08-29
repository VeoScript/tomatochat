import type { GetStaticPaths, GetStaticProps, GetStaticPropsContext, NextPage } from 'next'
import React from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import SEO from '../../../../components/SEO'
import MainLayout from '../../../../layouts/Main'
import PostURL from '../../../../layouts/Panels/PostURL'
import ErrorPage from '../../../../layouts/Error'
import { useSession } from 'next-auth/react'
import { useGetUser, useGetProfile, useGetUserPost } from '../../../../lib/ReactQuery'
import prisma from '../../../../lib/Prisma'

interface IProps {
  post: {
    id: string,
    description: string
    stories: any
    userId: string,
    user: any
  }
}

const PostID: NextPage<IProps> = ({ post }) => {

  // const router = useRouter()

  const { data: session } = useSession()

  const email = session ? session.user?.email : ''
  const userId = post.userId
  const postId = post.id

  const { data: user, isError: userError } = useGetUser(email as string)
  const { data: profile, isError: profileError } = useGetProfile(userId)
  const { data: specificPost, isError: specificPostError } = useGetUserPost(String(postId))

  if (userError || profileError || specificPostError) {
    return (
      <ErrorPage
        errorType={'Error'}
        errorMessage={'Failed to fetch some data. Try to reload the page.'}
      />
    )
  }
  
  return (
    <React.Fragment>
      <Head>
        <title>{ profile ? `Post of ${profile?.name}` : 'Loading...' }</title>
        <SEO
          title={`Post of ${post.user.name}' in TomatoChat.`}
          description={post.description}
          image={post.stories.length > 0 ? post.stories[0].image : null}
          url={`${process.env.VERCEL_BASE_URL}/profile/${post.userId}post/${post.id}`}
        />
      </Head>
      <MainLayout user={user}>
        {specificPost && (
          <PostURL
            user={user}
            post={specificPost}
          />
        )}
      </MainLayout>
    </React.Fragment>
  )
}

export const getStaticProps: GetStaticProps = async (ctx: GetStaticPropsContext) => {
  const { params } = ctx
  const post = await prisma.post.findFirst({
    where: {
      id: String(params?.postId)
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
  if (!post) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    }
  }
  return {
    props: {
      post: JSON.parse(JSON.stringify(post)) //serializeing the createdAt column
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      user: {
        select: {
          id: true
        }
      }
    }
  })
  return {
    paths: posts.map((post: { id: string, user: { id: string } }) => ({
      params: {
        id: post.user.id,
        postId: post.id
      }
    })),
    fallback: 'blocking'
  }
}

export default PostID
