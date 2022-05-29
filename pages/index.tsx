import type { NextPage } from 'next'
import React from 'react'
import Head from 'next/head'
import Router from 'next/router'
import SEO from '../components/SEO'
import MainLayout from '../layouts/Main'
import NewsFeed from '../layouts/Panels/NewsFeed'
import LoadingPage from '../layouts/Loading'
import ErrorPage from '../layouts/Error'
import { useSession } from 'next-auth/react'
import { useGetUser } from '../lib/ReactQuery'

const Home: NextPage = () => {

  const { data: session, status,  } = useSession()
  
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
        <title>TomatoChat</title>
        <SEO
          title="TomatoChat (Login)"
          description="The Aesthetic Messenger"
          image="https://i.ibb.co/3yrC1WK/tomatochat.png"
          url="https://tomatochat.vercel.app/"
        />
      </Head>
      <MainLayout user={user}>
        <NewsFeed />
      </MainLayout>
    </React.Fragment>
  )
}

export default Home
