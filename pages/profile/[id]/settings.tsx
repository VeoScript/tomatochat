import type { GetStaticPaths, GetStaticProps, GetStaticPropsContext, NextPage } from 'next'
import React from 'react'
import Head from 'next/head'
import Router from 'next/router'
import MainLayout from '../../../layouts/Main'
import Profile from '../../../layouts/Panels/Profile'
import LoadingPage from '../../../layouts/Loading'
import ErrorPage from '../../../layouts/Error'
import { useSession } from 'next-auth/react'
import { useGetUser, useGetProfile } from '../../../lib/ReactQuery'
import prisma from '../../../lib/Prisma'

interface IProps {
  params: any
}

const Settings: NextPage<IProps> = ({ params }) => {

  const { data: session, status } = useSession()

  const email = session ? session.user?.email : ''
  const userId = params?.id

  const { data: user, isLoading: userLoading, isError: userError } = useGetUser(email as string)
  const { data: profile, isLoading: profileLoading, isError: profileError } = useGetProfile(userId as string)

  if (status === 'unauthenticated') {
    Router.replace('/login')
    return (
      <LoadingPage />
    )
  }

  if (status === 'loading' || userLoading || profileLoading) {
    return (
      <LoadingPage />
    )
  }

  if (userError || profileError) {
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
        <title>{ profile.name }</title>
      </Head>
      <MainLayout user={user}>
        <Profile
          user={user}
          profile={profile}
        />
      </MainLayout>
    </React.Fragment>
  )
}

export const getStaticProps: GetStaticProps = async (ctx: GetStaticPropsContext) => {
  const { params } = ctx
  const users = await prisma.user.findFirst({
    where: {
      id: String(params?.id)
    },
    select: {
      id: true
    }
  })
  if (!users) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    }
  }
  return {
    props: {
      params
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true
    }
  })
  return {
    paths: users.map((user: { id: string }) => ({
      params: {
        id: user.id
      }
    })),
    fallback: 'blocking'
  }
}

export default Settings
