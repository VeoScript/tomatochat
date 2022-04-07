import React from 'react'
import Link from 'next/link'
import Profile from '../components/Images/Profile'
import { RiSearchLine, RiNotification4Line } from 'react-icons/ri'

interface IProps {
  children: any
}

const MainLayout: React.FC<IProps> = ({ children }) => {
  return (
    <main className="font-poppins flex flex-col w-full h-screen overflow-hidden text-white bg-gradient-to-br from-[#1B1325] via-[#12111B] to-[#18132A]">
      <div className="inline-flex items-center justify-between w-full p-5 border-b border-[#1F1836]">
        <Link href="/">
          <a className="font-rubikglitch text-2xl text-white">TomatoChat</a>
        </Link>
        <div className="inline-flex items-center space-x-5">
          <span className="inline-flex items-center px-3 py-2 space-x-2 rounded-lg text-zinc-400 bg-[#201A2C] border border-transparent focus-within:border-purple-600">
            <input
              type="text"
              className="outline-none bg-transparent text-sm"
              placeholder="Search"
            />
            <RiSearchLine className="w-4 h-4" />
          </span>
          <button 
            type="button"
            className="outline-none"
          >
            <RiNotification4Line className="w-5 h-5" />
          </button>
          <Link href="/">
            <a className="flex">
              <Profile src={"https://lh3.googleusercontent.com/a-/AOh14GgiGck0MqWRwZX8oBYaPRSE0Hs69oFqKRW0Tsha-w=s96-c"} />
            </a>
          </Link>
        </div>
      </div>
      <div className="inline-flex w-full h-full overflow-hidden">
        {children}
      </div>
    </main>
  )
}

export default MainLayout