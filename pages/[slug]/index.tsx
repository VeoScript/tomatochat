import type { GetStaticPaths, GetStaticProps, GetStaticPropsContext, NextPage } from 'next'
import React from 'react'
import Head from 'next/head'
import Router from 'next/router'
import MainLayout from '../../layouts/Main'
import Chats from '../../layouts/Panels/Chats'
import LoadingPage from '../../layouts/Loading'
import ErrorPage from '../../layouts/Error'
import { useSession } from 'next-auth/react'
import { useGetUser } from '../../lib/ReactQuery'
import prisma from '../../lib/Prisma'

interface IProps {
  params: any
  room: any
}

const RoomSlug: NextPage<IProps> = ({ params, room }) => {

  const { data: session, status } = useSession()

  const email = session ? session.user?.email : ''

  const { data: user, isLoading, isError } = useGetUser(email as string)

  if (status === 'loading' || isLoading) {
    return (
      <LoadingPage />
    )
  }

  if (isError) {
    return (
      <ErrorPage
        errorType={'Error'}
        errorMessage={'Failed to fetch some data. Try to reload the page.'}
      />
    )
  }

  if (status === 'unauthenticated') {
    Router.replace('/login')
    return (
      <LoadingPage />
    )
  }

  return (
    <React.Fragment>
      <Head>
        <title>TomatoChat - {room.name}</title>
      </Head>
      <MainLayout user={user}>
        <Chats user={user} room={params} />
      </MainLayout>
    </React.Fragment>
  )
}

export const getStaticProps: GetStaticProps = async (ctx: GetStaticPropsContext) => {
  const { params } = ctx
  const room = await prisma.room.findFirst({
    where: {
      slug: String(params?.slug),
    },
    select: {
      id: true,
      index: true,
      photo: true,
      name: true,
      description: true,
      privacy: true,
      slug: true,
      userId: true
    }
  })
  return {
    props: {
      params,
      room
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const rooms = await prisma.room.findMany({
    select: {
      slug: true
    }
  })
  return {
    paths: rooms.map((room: { slug: string }) => ({
      params: {
        slug: room.slug
      }
    })),
    fallback: 'blocking'
  }
}

export default RoomSlug
