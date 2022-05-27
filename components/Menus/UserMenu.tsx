import React from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { RiUser3Line, RiSettingsLine, RiLogoutCircleLine } from 'react-icons/ri'

interface IProps {
  children: any
  title: string
  user: any
}

const UserMenu: React.FC<IProps> = ({ children, title, user }) => {

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
          <div className="absolute top-14 right-5 z-20 w-48">
            <div className="flex w-full overflow-hidden shadow-sm rounded-md ring-1 ring-[#1F1E35] bg-gradient-to-br from-[#1B1325] via-[#12111B] to-[#18132A] focus:outline-none">
              <div className="flex flex-col w-full divide-y divide-[#1F1E35]">
                <Link href="/">
                  <a className="inline-flex items-center space-x-2 p-3 font-light text-xs text-left cursor-pointer transition ease-in-out duration-200 hover:bg-[#1F1E35]">
                    <RiUser3Line className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                    <span>{ user.name }</span>
                  </a>
                </Link>
                <Link href="/">
                  <a className="inline-flex items-center space-x-2 p-3 font-light text-xs text-left cursor-pointer transition ease-in-out duration-200 hover:bg-[#1F1E35]">
                    <RiSettingsLine className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                    <span>Settings</span>
                  </a>
                </Link>
                <button
                  className="inline-flex items-center space-x-2 p-3 font-light text-xs text-left cursor-pointer transition ease-in-out duration-200 hover:bg-red-600"
                  onClick={() => {
                    signOut()
                  }}
                >
                  <RiLogoutCircleLine className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default UserMenu