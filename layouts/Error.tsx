import React from 'react'
import Head from 'next/head'

interface IProps {
  errorType: string
  errorMessage: string
}

const ErrorPage: React.FC<IProps> = ({ errorType, errorMessage }) => {
  return (
    <React.Fragment>
      <Head>
        <title>TomatoChat (Error)</title>
      </Head>
      <main className="flex items-center justify-center w-full h-screen text-zinc-600 dark:text-white bg-zinc-100 dark:bg-gradient-to-br dark:from-[#1B1325] dark:via-[#12111B] dark:to-[#18132A]">
        <div className="flex flex-col items-center w-full space-y-2">
          <span className="flex font-poppins text-3xl">
            <p className="font-rubikglitch text-tomato-lavender dark:text-white lowercase">tomatochat</p>
          </span>
          <div className="inline-flex items-center space-x-2">
            <span className="font-bold text-lg text-purple-800">{ errorType }:</span>
            <span className="font-light">{ errorMessage }</span>
          </div>
        </div>
      </main>
    </React.Fragment>
  )
}

export default ErrorPage