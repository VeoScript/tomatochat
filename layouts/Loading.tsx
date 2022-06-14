import React from 'react'
import Head from 'next/head'
import SEO from '../components/SEO'
import CubeLoader from '../utils/CubeLoader'

interface IProps {
  room?: any
  post?: any
}

const LoadingPage: React.FC<IProps> = ({ room, post }) => {
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
        {post
          ? 
            <SEO
              title={`TomatoChat - ${post.user.name}'s Post`}
              description={post.description}
              image={post.stories[0].photo}
              url={`https://tomatochat.vercel.app/post/${post.id}`}
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
      <main className="flex items-center justify-center w-full h-screen text-zinc-600 dark:text-white bg-tomato-light dark:bg-tomato-dark">
        <div className="flex flex-col items-center w-full space-y-2">
          <CubeLoader />
          <span className="flex font-poppins text-3xl">
            <p className="font-rubikglitch text-tomato-red">tomato<span className="text-tomato-orange">chat</span></p>
          </span>
          <span className="font-light">Loading...</span>
        </div>
      </main>
    </React.Fragment>
  )
}

export default LoadingPage