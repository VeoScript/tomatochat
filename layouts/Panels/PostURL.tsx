import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PostProfile from '../../components/Images/PostProfile'
import Comments from '../../components/Cards/Comments'
import BookmarkButton from '../../components/Interactions/BookmarkButton'
import LikeButton from '../../components/Interactions/LikeButton'
import ShareMenu from '../../components/Menus/ShareMenu'
import PostMenu from '../../components/Menus/PostMenu'
import moment from 'moment'
import { RiHeart3Fill, RiMoreFill, RiShareFill } from 'react-icons/ri'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

interface IProps {
  user: any
  post: any
}

const PostURL: React.FC<IProps> = ({ user, post }) => {
  return (
    <div className={`inline-flex justify-center w-full max-w-full h-full overflow-hidden ${user && 'border-x border-zinc-300 dark:border-tomato-dark-secondary'}`}>
      <div className="flex flex-col justify-start w-full max-w-5xl p-5 space-y-3 overflow-x-hidden overflow-y-scroll scroll-smooth scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
        <div className="flex flex-col items-start justify-center w-full px-3 space-y-5">
          <div className="flex flex-row items-center justify-between w-full">
            <Link href={`/profile/${post.user.id}`}>
              <a className="inline-flex items-center space-x-2 outline-none">
                <PostProfile src={post.user.image} />
                <div className="flex flex-col">
                  <span className="font-semibold text-xl outline-none">{ post.user.name }</span>
                  <span className="font-light text-xs text-zinc-400">
                    {moment(post.createdAt).fromNow()}
                  </span>
                </div>
              </a>
            </Link>
            <div className="flex items-center px-3 space-x-2">
              <div className="flex items-center space-x-2">
                {user
                  ? <LikeButton
                      post={post}
                      user={user}
                    />
                  : <RiHeart3Fill className="w-6 h-6 text-neutral-400" />
                }
                <span className="font-light text-zinc-600 dark:text-zinc-300">{post.likes.length}</span>
              </div>
              {user && (
                <BookmarkButton
                  post={post}
                  user={user}
                />
              )}
              {user && (
                <div className="relative flex mt-1">
                  <ShareMenu
                    title="Share"
                    user={user}
                    post={post}              
                  >
                    <div className="text-neutral-400 outline-none transition ease-in-out duration-200 transform hover:scale-90">
                      <RiShareFill className="w-6 h-6" />
                    </div>
                  </ShareMenu>
                </div>
              )}
              {user && (
                <div className="relative flex">
                  <PostMenu
                    title="More"
                    user={user}
                    post={post}          
                  >
                    <span className="text-neutral-400 outline-none transition ease-in-out duration-200 transform hover:scale-90">
                      <RiMoreFill className="w-6 h-6" />
                    </span>
                  </PostMenu>
                </div>
              )}
            </div>
          </div>
          {post.description && (
            <div className={`${post.stories.length > 0 ? 'flex w-full px-3' : 'flex flex-row items-center w-full px-3 py-5'}`}>
              <p className={`${post.stories.length > 0 ? 'font-normal text-sm' : 'font-bold text-3xl'} break-all whitespace-pre-wrap`}>{ post.description }</p>
            </div>
          )}
        </div>
        <div className="flex flex-row items-start justify-center w-full h-full space-x-5">
          {post.stories.length > 0 && (
            <Swiper className="relative inline-flex items-center justify-center w-full h-full rounded-xl bg-tomato-light dark:bg-tomato-dark-slight">
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
              {post.stories.map((story: any, i: number) => (
                <SwiperSlide key={i}>
                  <Image
                    key={story.image}
                    src={story.image}
                    blurDataURL={story.image}
                    placeholder="blur"
                    className="bg-contain bg-center"
                    layout="fill"
                    width="100%"
                    height="100%"
                    quality={100}
                    objectFit='contain'
                    alt="Post Image"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          <div className={`flex flex-col w-full h-full ${post.stories.length > 0 ? 'max-w-sm' : 'justify-start max-w-full mt-3 px-3'}`}>
            <Comments
              post={post}
              user={user}
              withImage={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostURL