import React from 'react'
import Link from 'next/link'
import { Menu } from '@headlessui/react'
import { RiUser3Line, RiShieldLine, RiForbidLine } from 'react-icons/ri'

interface IProps {
  children: any
  role: string,
  title: string,
  memberUserId: string,
  loggedInUserId: string
}

const MemberMenu: React.FC<IProps> = ({ children, role, title, memberUserId, loggedInUserId }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        title={title}
        type="button"
        className="outline-none"
      >
        {children}
      </Menu.Button>
      <Menu.Items className="flex flex-col overflow-hidden absolute right-0 z-50 w-48 mt-2 origin-top-right bg-gradient-to-br from-[#1B1325] via-[#12111B] to-[#18132A] divide-y divide-[#1F1E35] rounded-md shadow-lg ring-1 ring-[#1F1E35] focus:outline-none">
        <Menu.Item>
          <Link href="/">
            <a className="inline-flex items-center space-x-2 p-3 font-light text-xs text-left cursor-pointer transition ease-in-out duration-200 hover:bg-[#1F1E35]">
              <RiUser3Line className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
              <span>View Profile</span>
            </a>
          </Link>
        </Menu.Item>
        {role === 'ADMIN' && (
          <React.Fragment>
            <Menu.Item>
              <Link href="/">
                <a className="inline-flex items-center space-x-2 p-3 font-light text-xs text-left cursor-pointer transition ease-in-out duration-200 hover:bg-[#1F1E35]">
                  <RiShieldLine className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                  <span>Change Role</span>
                </a>
              </Link>
            </Menu.Item>
            {memberUserId !== loggedInUserId && (
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`inline-flex items-center space-x-2 p-3 font-light text-xs text-left cursor-pointer ${active && 'bg-red-600 text-purewhite  transition ease-in-out duration-200'}`}
                    onClick={() => console.log('Kickout')}
                  >
                    <RiForbidLine className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                    <span>Kick Out</span>
                  </button>
                )}
              </Menu.Item>
            )}
          </React.Fragment>
        )}
      </Menu.Items>
    </Menu>
  )
}

export default MemberMenu