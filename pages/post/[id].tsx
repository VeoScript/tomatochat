import type { GetStaticPaths, GetStaticProps, GetStaticPropsContext, NextPage } from 'next'
import React from 'react'
import Head from 'next/head'
import Router from 'next/router'
import MainLayout from '../../layouts/Main'
import PostURL from '../../layouts/Panels/PostURL'
import LoadingPage from '../../layouts/Loading'
import ErrorPage from '../../layouts/Error'
import { useSession } from 'next-auth/react'
import { useGetUser, useGetProfile, useGetUserPost } from '../../lib/ReactQuery'
import prisma from '../../lib/Prisma'

interface IProps {
  post: {
    id: string,
    userId: string
  }
}

const PostID: NextPage<IProps> = ({ post }) => {

  const { data: session, status } = useSession()

  const email = session ? session.user?.email : ''
  const userId = post.userId
  const postId = post.id

  const { data: user, isLoading: userLoading, isError: userError } = useGetUser(email as string)
  const { data: profile, isLoading: profileLoading, isError: profileError } = useGetProfile(userId)
  const { data: specificPost, isLoading: specificPostLoading, isError: specificPostError } = useGetUserPost(postId)

  if (status === 'unauthenticated') {
    Router.replace('/login')
    return (
      <LoadingPage post={specificPost} />
    )
  }

  if (status === 'loading' || userLoading || profileLoading || specificPostLoading) {
    return (
      <LoadingPage post={specificPost} />
    )
  }

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
        <title>Post of { profile.name }</title>
      </Head>
      <MainLayout user={user}>
        <PostURL
          user={user}
          post={specificPost}
        />
      </MainLayout>
    </React.Fragment>
  )
}

export const getStaticProps: GetStaticProps = async (ctx: GetStaticPropsContext) => {
  const { params } = ctx
  const post = await prisma.post.findFirst({
    where: {
      id: String(params?.id)
    },
    select: {
      id: true,
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
      id: true
    }
  })
  return {
    paths: posts.map((post: { id: string }) => ({
      params: {
        id: post.id
      }
    })),
    fallback: 'blocking'
  }
}

export default PostID
