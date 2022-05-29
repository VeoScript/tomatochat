import type { NextPage } from 'next'
import React from 'react'
import Head from 'next/head'
import Router from 'next/router'
import MainLayout from '../layouts/Main'
import DiscoverPanel from '../layouts/Panels/Discover'
import LoadingPage from '../layouts/Loading'
import ErrorPage from '../layouts/Error'
import { useSession } from 'next-auth/react'
import { useGetUser } from '../lib/ReactQuery'

const Discover: NextPage = () => {

  const { data: session, status } = useSession()

  const email = session ? session.user?.email : ''

  const { data: user, isLoading, isError } = useGetUser(email as string)

  if (status === 'unauthenticated') {
    Router.replace('/login')
    return (
      <LoadingPage />
    )
  }

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

  return (
    <React.Fragment>
      <Head>
        <title>TomatoChat (Discover)</title>
      </Head>
      <MainLayout user={user}>
        <DiscoverPanel user={user} />
      </MainLayout>
    </React.Fragment>
  )
}

export default Discover
