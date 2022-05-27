import React from 'react'
import Head from 'next/head'
import CubeLoader from '../utils/CubeLoader'

const LoadingPage = () => {
  return (
    <React.Fragment>
      <Head>
        <title>TomatoChat (Loading...)</title>
      </Head>
      <main className="flex items-center justify-center w-full h-screen text-zinc-600 dark:text-white bg-white dark:bg-gradient-to-br dark:from-[#1B1325] dark:via-[#12111B] dark:to-[#18132A]">
        <div className="flex flex-col items-center w-full space-y-2">
          <CubeLoader />
          <span className="flex font-poppins text-3xl">
            <p className="font-rubikglitch text-zinc-800 dark:text-white lowercase">tomatochat</p>
          </span>
          <span className="font-light">Loading...</span>
        </div>
      </main>
    </React.Fragment>
  )
}

export default LoadingPage