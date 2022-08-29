import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { RiHome5Line, RiCompass3Line, RiAddLine, RiNotification4Line, RiMessage3Line } from 'react-icons/ri'

const BottomBar = () => {

  const { pathname, asPath } = useRouter()

  return (
    <div className={`${ pathname === '/room/[slug]' ? 'hidden' : 'absolute md:hidden bottom-0 z-50 w-full px-5 py-3 border-t border-zinc-300 dark:border-tomato-dark-secondary overflow-hidden text-[#333] dark:text-white bg-tomato-light-secondary dark:bg-tomato-dark' }`}>
      <div className="flex items-center justify-between w-full">
        <Link href="/">
          <a
            title="Home"
            className="outline-none"
          >
            <RiHome5Line className={`${pathname === '/' ? 'text-tomato-orange' : 'text-zinc-500'} w-8 h-8 transition ease-in-out duration-200 transform hover:scale-90`} />
          </a>
        </Link>
        <Link href="/discover">
          <a
            title="Home"
            className="outline-none"
          >
            <RiCompass3Line className={`${pathname === '/discover' ? 'text-tomato-orange' : 'text-zinc-500'} w-8 h-8 transition ease-in-out duration-200 transform hover:scale-90`} />
          </a>
        </Link>
        <Link href="/">
          <a
            title="Home"
            className="outline-none"
          >
            <RiAddLine className={`${pathname === '/create-post' ? 'text-tomato-orange' : 'text-zinc-500'} w-9 h-9 transition ease-in-out duration-200 transform hover:scale-90`} />
          </a>
        </Link>
        <Link href="/">
          <a
            title="Home"
            className="outline-none"
          >
            <RiNotification4Line className={`${pathname === '/notifications' ? 'text-tomato-orange' : 'text-zinc-500'} w-8 h-8 transition ease-in-out duration-200 transform hover:scale-90`} />
          </a>
        </Link>
        <Link href="/">
          <a
            title="Home"
            className="outline-none"
          >
            <RiMessage3Line className={`${pathname === '/room' ? 'text-tomato-orange' : 'text-zinc-500'} w-8 h-8 transition ease-in-out duration-200 transform hover:scale-90`} />
          </a>
        </Link>
      </div>
    </div>
  )
}

export default BottomBar