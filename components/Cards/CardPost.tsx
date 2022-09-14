import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import PostProfile from '../../components/Images/PostProfile'
import PostMenu from '../Menus/PostMenu'
import ViewPost from '../Modals/Body/ViewPost'
import LikeButton from '../Interactions/LikeButton'
import BookmarkButton from '../Interactions/BookmarkButton'
import ShareMenu from '../Menus/ShareMenu'
import moment from 'moment'
import { RiShareFill, RiMoreFill } from 'react-icons/ri'

interface IProps {
  profile: any
  user: any
  post: any
}

const CardPost: React.FC<IProps> = ({ profile, user, post }) => {

  const { pathname } = useRouter()

  // get likers name
  const getLikers = post.likes.map((liker: { user: { name: string } }) => {
    return [
      liker.user.name
    ]
  })

  return (
    <div className="flex flex-col w-full p-5 space-y-5 rounded-xl back-shadow to-tomato-dark-secondary/50 bg-white dark:bg-tomato-dark-slight">
      <div className="flex flex-row items-start justify-between w-full">
        <div className="flex items-start space-x-2">
          <PostProfile src={(pathname === '/' || pathname === '/bookmarks') ? post.user.image : profile.image} />
          <div className="flex flex-col">
            <Link href={`/profile/${(pathname === '/' || pathname === '/bookmarks') ? post.user.id : profile.id}`}>
              <a className="font-bold text-base">{(pathname === '/' || pathname === '/bookmarks')? post.user.name : profile.name}</a>
            </Link>
            <p className="font-light text-xs text-zinc-400">
              {moment(post.createdAt).fromNow()}
            </p>
          </div>
        </div>
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
      </div>
      <div className="flex flex-col w-full space-y-2">
        <p className={`${post.stories.length == 0 ? 'text-xl' : 'text-base'} ml-1 mb-3 break-all whitespace-pre-wrap`}>{post.description}</p>
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
            <ViewPost
              post={post}
              user={user}
              commentDisplaySmall={false}
            />
          </div>
        )}
        <div className="inline-flex items-center justify-between w-full py-3">
          <div className="flex items-center space-x-2">
            <LikeButton
              post={post}
              user={user}
            />
            <ViewPost
              post={post}
              user={user}
              commentDisplaySmall={true} 
            />
            <div className="relative flex">
              <ShareMenu
                title="Share"
                user={user}
                post={post}              
              >
                <span className="text-neutral-400 outline-none">
                  <RiShareFill className="w-6 h-6 transition ease-in-out duration-200 transform hover:scale-90" />
                </span>
              </ShareMenu>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <BookmarkButton
              post={post}
              user={user}
            />
          </div>
        </div>
        <div className="inline-flex items-center w-full space-x-2">
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
          {(post.likes.length > 0 && post._count.comments > 0) && (
            <span className="text-neutral-500">&bull;</span>
          )}
          {post._count.comments > 0 && (
            <>
              <div className="flex items-center space-x-1 select-none text-xs">
                <span className="font-bold">{post._count.comments}</span>
                <span className="font-light text-neutral-400">
                  {post._count.comments > 1 ? 'Comments' : 'Comment'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CardPost