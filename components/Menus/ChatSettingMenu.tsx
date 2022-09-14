import React from 'react'
import Link from 'next/link'
import RoomSettings from '../Modals/Body/RoomSettings'
import Leave from '../Modals/Body/Leave'
import DeleteRoom from '../Modals/Body/DeleteRoom'
import { RiFeedbackLine } from 'react-icons/ri'

interface IProps {
  children: any
  role: string
  title: string
  room: any
  user: any
  userId: string
  getJoinedUser: any
}

const ChatSettingMenu: React.FC<IProps> = ({ children, role, title, room, user, userId, getJoinedUser }) => {

  const [isDropdown, setIsDropdown] = React.useState(false)

  const getMembers = getJoinedUser.map((admin: any) => {
    return {
      name: admin.userName,
      role: admin.userRole
    }
  })

  const getAdmins = getMembers.filter((admin: any) => admin.role === 'ADMIN')

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
            className={`${isDropdown ? 'z-10 block fixed inset-0 w-full h-screen cursor-default focus:outline-none' : 'hidden'}`}
            type="button"
            onClick={() => {
              setIsDropdown(false)
            }} 
          />
          <div className="fixed origin-top-right right-0 z-20 w-48">
            <div className="flex w-full overflow-hidden shadow-sm rounded-md ring-1 ring-zinc-300 dark:ring-[#464A4D] bg-white dark:bg-tomato-dark-secondary focus:outline-none">
              <div className="flex flex-col w-full divide-y divide-zinc-300 dark:divide-[#464A4D]">
                {role === 'ADMIN' && (
                  <RoomSettings
                    room={room}
                    user={user}
                  />
                )}
                <Link href="/">
                  <a className="inline-flex items-center space-x-2 p-3 font-light text-xs text-left cursor-pointer transition ease-in-out duration-200 hover:bg-zinc-100 dark:hover:bg-[#464A4D]">
                    <RiFeedbackLine className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                    <span>Report</span>
                  </a>
                </Link>
                {/* the logic here is if the admin is only one in the room, they cannot leave unless it's more than 1 admins */}
                {(role === "ADMIN" && getAdmins.length > 1) && (
                  <Leave
                    room={room}
                    userId={userId}
                  />
                )}
                {/* user will always be leave anytime they want */}
                {role === "USER" && (
                  <Leave
                    room={room}
                    userId={userId}
                  />
                )}
                {role === "ADMIN" && (
                  <DeleteRoom room={room} />
                )}
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default ChatSettingMenu