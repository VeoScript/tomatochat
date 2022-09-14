import React from 'react'
import Profile from '../Images/Profile'
import UserMenu from '../Menus/UserMenu'
import { RiNotification4Line } from 'react-icons/ri'

interface IProps {
  user: any
}

const NavBarProfileMenu: React.FC<IProps> = ({ user }) => {
  return (
    <div className="sticky top-0 z-10 inline-flex items-center justify-end w-full p-3">
      <div className="flex flex-row items-center justify-start w-full px-3 py-5 rounded-xl back-shadow">
        {user && (
          <div className="relative flex flex-row items-center justify-between space-x-5 w-full md:w-full">
            <UserMenu
              title={user.name}
              user={user}
            >
              <div className="flex flex-row items-center space-x-2">
                <Profile src={user.image} />
                <h2 className="font-bold text-sm">{ user.name }</h2>
              </div>
            </UserMenu>
            <button 
              type="button"
              className="hidden md:flex outline-none"
            >
              <RiNotification4Line className="w-6 h-6 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NavBarProfileMenu