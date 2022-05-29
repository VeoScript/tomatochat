import React from 'react'
import Head from 'next/head'
import SEO from '../components/SEO'
import CubeLoader from '../utils/CubeLoader'

interface IProps {
  room?: any
}

const LoadingPage: React.FC<IProps> = ({ room }) => {
  return (
    <React.Fragment>
      <Head>
        <title>TomatoChat (Loading...)</title>
        {room
          ? 
            <SEO
              title={`TomatoChat - ${room.name}`}
              description={room.description}
              image={room.photo}
              url={`https://tomatochat.vercel.app/${room.slug}`}
            />
          :
            <SEO
              title="TomatoChat (Login)"
              description="The Aesthetic Messenger"
              image="https://i.ibb.co/3yrC1WK/tomatochat.png"
              url="https://tomatochat.vercel.app/"
            />
        }
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