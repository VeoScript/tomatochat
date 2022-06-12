import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import PostProfile from '../../components/Images/PostProfile'
import PhotoSwiper from '../PhotoSwiper'
import LikeButton from '../Interactions/LikeButton'
import moment from 'moment'
import { RiChat1Fill, RiShareFill, RiBookmarkFill, RiMoreFill } from 'react-icons/ri'

interface IProps {
  profile: any
  post: any
}

const CardPost: React.FC<IProps> = ({ profile, post }) => {

  const { pathname } = useRouter()

  // get likers name
  const getLikers = post.likes.map((liker: { user: { name: string } }) => {
    return [
      liker.user.name
    ]
  })

  return (
    <div className="flex flex-col w-full p-5 space-y-5 rounded-md bg-white dark:bg-tomato-dark-slight">
      <div className="flex flex-row items-start justify-between w-full">
        <div className="flex items-start space-x-2">
          <PostProfile src={pathname === '/' ? post.user.image : profile.image} />
          <div className="flex flex-col">
            <Link href={`/profile/${pathname === '/' ? post.user.id : profile.id}`}>
              <a className="font-bold text-base">{pathname === '/' ? post.user.name : profile.name}</a>
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
        <p className={`${post.stories.length == 0 ? 'text-xl' : 'text-base'} ml-1 mb-3 whitespace-pre-wrap`}>{post.description}</p>
        {post.stories.length > 0 && (
          <div className="relative flex w-full">
            {post.stories.length > 1 && (
              <>
                <span className="absolute z-10 top-3 right-3 px-3 py-1 rounded-md select-none text-xs text-white bg-black bg-opacity-50">
                  {post.stories.length} Photos
                </span>
                <span className="absolute z-10 bottom-3 right-3 px-3 py-1 rounded-md select-none text-xs text-white bg-black bg-opacity-50">
                  Slide to see more...
                </span>
              </>
            )}
            <PhotoSwiper post={post} />
          </div>
        )}
        <div className="inline-flex items-center justify-between w-full py-3">
          <div className="flex items-center space-x-2">
            <LikeButton
              post={post}
              user={profile}
            />
            <button
              type="button"
              className="text-neutral-500 outline-none transition ease-in-out duration-200 transform hover:scale-90"
            >
              <RiChat1Fill className="w-6 h-6" />
            </button>
            <button
              type="button"
              className="text-neutral-500 outline-none transition ease-in-out duration-200 transform hover:scale-90"
            >
              <RiShareFill className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="text-neutral-500 outline-none transition ease-in-out duration-200 transform hover:scale-90"
            >
              <RiBookmarkFill className="w-6 h-6" />
            </button>
          </div>
        </div>
        {post.likes.length > 0 && (
          <div className="flex items-center space-x-1 select-none text-xs">
            <span className="font-light text-neutral-400">Liked by</span>
            <span className="font-bold">
              {getLikers[0]}
              {post.likes.length > 1 &&
                <>
                  <span className="inline font-light">&nbsp;and&nbsp;</span>
                  <span>{post.likes.length -1} others</span>
                </>
              }
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default CardPost