import type { NextPage } from 'next'
import React from 'react'
import Head from 'next/head'
import Main from '../layouts/Main'

const Home: NextPage = () => {
  return (
    <React.Fragment>
      <Head>
        <title>TomatoChat</title>
      </Head>
      <Main>
        <h1 className="font-rubikglitch text-2xl">TomatoChat</h1>
      </Main>
    </React.Fragment>
  )
}

export default Home
