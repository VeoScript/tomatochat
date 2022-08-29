import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import BottomBar from '../components/BottomBar'
import SearchPeople from '../components/Search/SearchPeople'
import UserMenu from '../components/Menus/UserMenu'
import Rooms from '../layouts/Panels/Rooms'
import Profile from '../components/Images/Profile'
import TomatoChatLogo from '../utils/TomatoChatLogo'
import { Toaster } from 'react-hot-toast'
import { RiNotification4Line } from 'react-icons/ri'

interface IProps {
  user: any
  children: any
}

const MainLayout: React.FC<IProps> = ({ user, children }) => {

  const { pathname } = useRouter()

  return (
    <main className="relative inline-flex justify-center w-full h-screen overflow-hidden bg-neutral-100 dark:bg-tomato-dark-slight">
      <div className={`${ pathname === '/room/[slug]' ? 'mb-0' : 'mb-10 md:mb-0' } font-poppins flex flex-col items-center w-full max-w-[1401px] h-auto md:h-full text-[#333] dark:text-white bg-tomato-light-secondary dark:bg-tomato-dark`}>
        <Toaster
          position="bottom-left"
          reverseOrder={true}
        />
        <div className="inline-flex items-center justify-center md:justify-between w-full p-4 space-x-5 md:space-x-0 border-x border-b border-zinc-300 dark:border-tomato-dark-secondary">
          <Link href="/">
            <a className="flex">
              <TomatoChatLogo
                width={30}
                height={30}
                fontSize="text-2xl"
              />
            </a>
          </Link>
          {user && (
            <div className="relative inline-flex items-center space-x-5 w-full md:w-auto">
              <div className="relative flex w-full">
                <SearchPeople />
              </div>
              <button 
                type="button"
                className="hidden md:flex outline-none"
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
          )}
        </div>
        <div className="flex flex-row w-full h-full overflow-hidden">
          {user && (
            <Rooms user={user} />
          )}
          {children}
        </div>
      </div>
      <BottomBar />
    </main>
  )
}

export default MainLayout