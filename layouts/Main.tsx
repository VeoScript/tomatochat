import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import SearchPeople from '../components/Search/SearchPeople'
import UserMenu from '../components/Menus/UserMenu'
import Rooms from '../layouts/Panels/Rooms'
import Profile from '../components/Images/Profile'
import Spinner from '../utils/Spinner'
import { Toaster } from 'react-hot-toast'
import { RiNotification4Line } from 'react-icons/ri'

interface IProps {
  user: any
  children: any
}

const MainLayout: React.FC<IProps> = ({ user, children }) => {

  const router = useRouter()

  return (
    <main className="font-poppins flex flex-col items-center w-full h-screen overflow-hidden text-[#333] dark:text-white bg-tomato-light-secondary dark:bg-tomato-dark">
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
      <div className="inline-flex items-center justify-between w-full p-4 border-b border-zinc-300 dark:border-tomato-dark-secondary">
        <Link href="/">
          <a className="font-rubikglitch text-2xl text-[#BD3207] lowercase">tomato<span className="text-tomato-orange">chat</span></a>
        </Link>
        {user && (
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
        )}
      </div>
      <div className="flex flex-row w-full max-w-[1401px] h-full overflow-hidden">
        {user && (
          <Rooms user={user} />
        )}
        {children}
      </div>
    </main>
  )
}

export default MainLayout