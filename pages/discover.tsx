import type { NextPage } from 'next'
import React from 'react'
import Head from 'next/head'
import Router from 'next/router'
import MainLayout from '../layouts/Main'
import DiscoverPanel from '../layouts/Panels/Discover'
import LoadingPage from '../layouts/Loading'
import { useSession } from 'next-auth/react'

const Discover: NextPage = () => {

  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <LoadingPage />
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
        <title>TomatoChat (Discover)</title>
      </Head>
      <MainLayout>
        <DiscoverPanel />
      </MainLayout>
    </React.Fragment>
  )
}

export default Discover
