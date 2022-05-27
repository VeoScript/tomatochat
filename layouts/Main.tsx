import React from 'react'
import Link from 'next/link'
import SearchPeople from '../components/Search/SearchPeople'
import UserMenu from '../components/Menus/UserMenu'
import Rooms from '../layouts/Panels/Rooms'
import Profile from '../components/Images/Profile'
import { Toaster } from 'react-hot-toast'
import { RiNotification4Line } from 'react-icons/ri'

interface IProps {
  user: any
  children: any
}

const MainLayout: React.FC<IProps> = ({ user, children }) => {
  return (
    <main className="font-poppins flex flex-col w-full h-screen overflow-hidden text-[#333] dark:text-white bg-white dark:bg-gradient-to-br dark:from-[#1B1325] dark:via-[#12111B] dark:to-[#18132A]">
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
      <div className="inline-flex items-center justify-between w-full p-5 border-b border-zinc-300 dark:border-[#1F1836]">
        <Link href="/">
          <a className="font-rubikglitch text-2xl text-zinc-800 dark:text-white lowercase">tomatochat</a>
        </Link>
        <div className="inline-flex items-center space-x-5">
          <SearchPeople />
          <button 
            type="button"
            className="outline-none"
          >
            <RiNotification4Line className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
          </button>
          <UserMenu
            title={user.name}
            user={user}
          >
            <div className="flex">
              <Profile src={user.image} />
            </div>
          </UserMenu>
        </div>
      </div>
      <div className="inline-flex w-full h-full overflow-hidden">
        <Rooms user={user} />
        {children}
      </div>
    </main>
  )
}

export default MainLayout