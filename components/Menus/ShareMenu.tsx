import React from 'react'
import { useRouter } from 'next/router'
import { RiFacebookCircleFill, RiLinkedinBoxFill, RiTwitterFill } from 'react-icons/ri'

interface IProps {
  children: any
  title: string
  user: any
  post: any
}

const ShareMenu: React.FC<IProps> = ({ children, title, user, post }) => {

  const router = useRouter()

  const [isDropdown, setIsDropdown] = React.useState(false)

  const shareOnFB = () => {
    var url = `https://www.facebook.com/sharer/sharer.php?u=${process.env.VERCEL_BASE_URL}/profile/${user.id}/post/${post.id}&t=You share ${post.user.name}'s post - ${post.description}`
    window.open(url, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=900')
    return false
  }

  const shareOnTwitter = () => {
    var url = `https://twitter.com/intent/tweet?url=${process.env.VERCEL_BASE_URL}/profile/${user.id}/post/${post.id}&text=You share ${post.user.name}'s post - ${post.description}`
    window.open(url, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=900')
    return false
  }

  const shareOnLinkedIn = () => {
    var url = `https://www.linkedin.com/sharing/share-offsite/?url=${process.env.VERCEL_BASE_URL}/profile/${user.id}/post/${post.id}`
    window.open(url, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=900')
    return false
  }

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
          <div className={`absolute ${router.pathname === '/profile/[id]/post/[postId]' ? 'right-0 top-0' : 'left-0 bottom-0'} z-20 w-48`}>
            <div className="flex w-full overflow-hidden shadow-sm rounded-md ring-1 ring-zinc-300 dark:ring-[#464A4D] bg-white dark:bg-tomato-dark-secondary focus:outline-none">
              <div className="flex flex-col w-full divide-y divide-zinc-300 dark:divide-[#464A4D]">
                <button
                  className="inline-flex items-center space-x-2 p-3 font-light text-xs text-left cursor-pointer transition ease-in-out duration-200 hover:bg-zinc-100 dark:hover:bg-[#464A4D]"
                  onClick={() => {
                    shareOnFB()
                    setIsDropdown(false)
                  }} 
                >
                  <RiFacebookCircleFill className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                  <span>Share to Facebook</span>
                </button>
                <button
                  className="inline-flex items-center space-x-2 p-3 font-light text-xs text-left cursor-pointer transition ease-in-out duration-200 hover:bg-zinc-100 dark:hover:bg-[#464A4D]"
                  onClick={() => {
                    shareOnTwitter()
                    setIsDropdown(false)
                  }} 
                >
                  <RiTwitterFill className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                  <span>Share to Twitter</span>
                </button><button
                  className="inline-flex items-center space-x-2 p-3 font-light text-xs text-left cursor-pointer transition ease-in-out duration-200 hover:bg-zinc-100 dark:hover:bg-[#464A4D]"
                  onClick={() => {
                    shareOnLinkedIn()
                    setIsDropdown(false)
                  }} 
                >
                  <RiLinkedinBoxFill className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                  <span>Share to LinkedIn</span>
                </button>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default ShareMenu