import type { NextPage } from 'next'
import React from 'react'
import Head from 'next/head'
import Router from 'next/router'
import MainLayout from '../layouts/Main'
import Bookmarks from '../layouts/Panels/Bookmarks'
import LoadingPage from '../layouts/Loading'
import ErrorPage from '../layouts/Error'
import { useSession } from 'next-auth/react'
import { useGetUser, useGetProfile } from '../lib/ReactQuery'

const BookmarksPage: NextPage = () => {

  const { data: session, status,  } = useSession()
  
  const email = session ? session.user?.email : ''

  const { data: user, isLoading, isError } = useGetUser(email as string)
  const { data: profile, isLoading: profileLoading, isError: profileError } = useGetProfile(user && String(user.id))

  if (status === 'unauthenticated') {
    Router.replace('/login')
    return (
      <LoadingPage />
    )
  }

  if (status === 'loading' || isLoading || profileLoading) {
    return (
      <LoadingPage />
    )
  }

  if (isError || profileError) {
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
      </Head>
      <MainLayout user={user}>
        <Bookmarks
          user={user}
          profile={profile}          
        />
      </MainLayout>
    </React.Fragment>
  )
}

export default BookmarksPage
