import React from 'react'
import Head from 'next/head'
import CubeLoader from '../utils/CubeLoader'

const LoadingPage = () => {
  return (
    <React.Fragment>
      <Head>
        <title>TomatoChat (Loading...)</title>
      </Head>
      <div className="flex items-center justify-center w-full h-screen">
        <div className="flex flex-col items-center w-full space-y-2">
          <CubeLoader />
          <span className="flex font-poppins text-3xl">
            <p className="font-rubikglitch text-white">TomatoChat</p>
          </span>
          <span className="font-light">Loading...</span>
        </div>
      </div>
    </React.Fragment>
  )
}

export default LoadingPage