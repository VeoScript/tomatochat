import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import PostProfile from '../../components/Images/PostProfile'
import PhotoSwiper from '../PhotoSwiper'
import moment from 'moment'
import { RiHeart3Fill, RiChat1Fill, RiShareFill, RiBookmarkFill, RiMoreFill } from 'react-icons/ri'

interface IProps {
  profile: any
  post: any
}

const CardPost: React.FC<IProps> = ({ profile, post }) => {

  const { asPath } = useRouter()

  return (
    <div className="flex flex-col w-full p-5 space-y-5 rounded-md bg-white dark:bg-[#1C1A28]">
      <div className="flex flex-row items-start justify-between w-full">
        <div className="flex items-start space-x-2">
          <PostProfile src={asPath === '/' ? post.user.image : profile.image} />
          <div className="flex flex-col">
            <Link href={`/profile/${asPath === '/' ? post.user.id : profile.id}`}>
              <a className="font-bold text-base">{asPath === '/' ? post.user.name : profile.name}</a>
            </Link>
            <p className="font-light text-xs text-zinc-400">
              {moment(post.createdAt).fromNow()}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="text-zinc-300 outline-none transition ease-in-out duration-200 transform hover:scale-90"
        >
          <RiMoreFill className="w-6 h-6" />
        </button>
      </div>
      <div className="flex flex-col w-full space-y-2">
        <p className="text-sm ml-1 mb-3">{post.description}</p>
        {post.stories.length > 0 && (
          <div className="relative flex w-full">
            <span className="absolute z-10 top-3 right-3 px-3 py-2 rounded-md text-xs text-white bg-black bg-opacity-50">
              {post.stories.length} Photos
            </span>
            <PhotoSwiper post={post} />
          </div>
        )}
        <div className="inline-flex items-center justify-between w-full py-3">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="text-red-600 outline-none transition ease-in-out duration-200 transform hover:scale-90"
            >
              <RiHeart3Fill className="w-6 h-6" />
            </button>
            <button
              type="button"
              className="text-zinc-300 outline-none transition ease-in-out duration-200 transform hover:scale-90"
            >
              <RiChat1Fill className="w-6 h-6" />
            </button>
            <button
              type="button"
              className="text-zinc-300 outline-none transition ease-in-out duration-200 transform hover:scale-90"
            >
              <RiShareFill className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="text-zinc-300 outline-none transition ease-in-out duration-200 transform hover:scale-90"
            >
              <RiBookmarkFill className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="inline-flex items-center justify-between w-full">
          <div className="flex items-center space-x-1 text-xs">
            <span className="font-light">Liked by</span>
            <span className="font-bold">Lisa and 128 others</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardPost