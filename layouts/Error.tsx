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
      <div className="flex items-center justify-center w-full h-screen text-white">
        <div className="flex flex-col items-center w-full space-y-2">
          <span className="flex font-poppins text-3xl">
            <p className="font-rubikglitch text-white">TomatoChat</p>
          </span>
          <div className="inline-flex items-center space-x-2">
            <span className="font-bold text-lg text-fd-scarlet">{ errorType }:</span>
            <span className="font-light">{ errorMessage }</span>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ErrorPage