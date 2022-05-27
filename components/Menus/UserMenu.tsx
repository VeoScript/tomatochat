import React from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { signOut } from 'next-auth/react'
import { RiUser3Line, RiSettingsLine, RiLogoutCircleLine, RiSunFill, RiMoonFill } from 'react-icons/ri'

interface IProps {
  children: any
  title: string
  user: any
}

const UserMenu: React.FC<IProps> = ({ children, title, user }) => {

  const { theme, setTheme } = useTheme()

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
            className={`${isDropdown ? 'z-20 block fixed inset-0 w-full h-full cursor-default focus:outline-none' : 'hidden'}`}
            type="button"
            onClick={() => {
              setIsDropdown(false)
            }} 
          />
          <div className="absolute top-16 right-5 z-30 w-48">
            <div className="flex w-full overflow-hidden shadow-sm rounded-md ring-1 ring-zinc-300 dark:ring-[#1F1E35] bg-white dark:bg-gradient-to-br dark:from-[#1B1325] dark:via-[#12111B] dark:to-[#18132A] focus:outline-none">
              <div className="flex flex-col w-full divide-y divide-zinc-300 dark:divide-[#1F1E35]">
                <Link href="/">
                  <a className="inline-flex items-center space-x-2 p-3 font-normal text-xs text-left cursor-pointer transition ease-in-out duration-200 hover:bg-zinc-100 dark:hover:bg-[#1F1E35]">
                    <RiUser3Line className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                    <span>{ user.name }</span>
                  </a>
                </Link>
                <Link href="/">
                  <a className="inline-flex items-center space-x-2 p-3 font-normal text-xs text-left cursor-pointer transition ease-in-out duration-200 hover:bg-zinc-100 dark:hover:bg-[#1F1E35]">
                    <RiSettingsLine className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                    <span>Settings</span>
                  </a>
                </Link>
                {theme !== undefined && (
                  <button
                    className="inline-flex items-center space-x-2 p-3 font-normal text-xs text-left cursor-pointer transition ease-in-out duration-200 hover:bg-zinc-100 dark:hover:bg-[#1F1E35]"
                    onClick={() => {
                      setTheme(theme === 'dark' ? 'light' : 'dark')
                    }}
                  >
                    {theme === 'dark'
                      ? 
                        <React.Fragment>
                          <RiSunFill className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                          <span>Switch to Light Mode</span>
                        </React.Fragment>
                      :
                        <React.Fragment>
                          <RiMoonFill className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                          <span>Switch to Dark Mode</span>
                        </React.Fragment>
                    }
                  </button>
                )}
                <button
                  className="inline-flex items-center space-x-2 p-3 font-normal text-xs text-left cursor-pointer transition ease-in-out duration-200 hover:bg-red-200 dark:hover:bg-red-600"
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