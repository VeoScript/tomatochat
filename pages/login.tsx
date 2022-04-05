import type { NextPage } from 'next'
import { Fragment } from 'react'
import Head from 'next/head'

const Login: NextPage = () => {
  return (
    <Fragment>
      <Head>
        <title>TomatoChat (Login)</title>
      </Head>
      <main>
        <h1 className="font-rubikglitch text-2xl">TomatoChat | Login</h1>
      </main>
    </Fragment>
  )
}

export default Login
