import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import DeletePost from '../Modals/Body/DeletePost'
import { RiExternalLinkLine, RiFeedbackLine } from 'react-icons/ri'

interface IProps {
  children: any
  title: string
  user: any
  post: any
}

const PostMenu: React.FC<IProps> = ({ children, title, user, post }) => {

  const [isDropdown, setIsDropdown] = React.useState(false)

  return (
    <React.Fragment>
      <button
        title={title}
        type="button"
        className="outline-none"
        onClick={() => {
          setIsDropdown(true)
        }}
      >
        {children}
      </button>
      {isDropdown && (
        <React.Fragment>
          <button 
            className={`${isDropdown ? 'z-10 block fixed inset-0 w-full h-full cursor-default focus:outline-none' : 'hidden'}`}
            type="button"
            onClick={() => {
              setIsDropdown(false)
            }} 
          />
          <div className="absolute top-10 right-0 z-20 w-48">
            <div className="flex w-full overflow-hidden shadow-sm rounded-md ring-1 ring-zinc-300 dark:ring-[#464A4D] bg-white dark:bg-tomato-dark-secondary focus:outline-none">
              <div className="flex flex-col w-full divide-y divide-zinc-300 dark:divide-[#464A4D]">
                {Router.pathname !== '/profile/[id]/post/[postId]' && (
                  <Link href={`/profile/${post.user.id}/post/${post.id}`}>
                    <a
                      className="inline-flex items-center space-x-2 p-3 font-light text-xs text-left cursor-pointer transition ease-in-out duration-200 hover:bg-zinc-100 dark:hover:bg-[#464A4D]"
                      onClick={() => {
                        setIsDropdown(false)
                      }} 
                    >
                      <RiExternalLinkLine className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                      <span>View Post</span>
                    </a>
                  </Link>
                )}
                <Link href={`/profile/${post.user.id}/post/${post.id}`}>
                  <a className="inline-flex items-center space-x-2 p-3 font-light text-xs text-left cursor-pointer transition ease-in-out duration-200 hover:bg-zinc-100 dark:hover:bg-[#464A4D]">
                    <RiFeedbackLine className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                    <span>Report</span>
                  </a>
                </Link>
                {post.user.id === user.id && (
                  <DeletePost
                    post={post}
                    setIsDropdown={setIsDropdown}
                  />
                )}
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default PostMenu