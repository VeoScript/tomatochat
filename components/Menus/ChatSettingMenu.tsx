import React from 'react'
import Link from 'next/link'
import Leave from '../Modals/Body/Leave'
import { RiSettingsLine, RiFeedbackLine } from 'react-icons/ri'
import DeleteRoom from '../Modals/Body/DeleteRoom'

interface IProps {
  children: any
  role: string,
  title: string,
  room: any
  userId: string
  getJoinedUser: any
}

const ChatSettingMenu: React.FC<IProps> = ({ children, role, title, room, userId, getJoinedUser }) => {

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
            className={`${isDropdown ? 'z-10 block fixed inset-0 w-full h-full cursor-default focus:outline-none' : 'hidden'}`}
            type="button"
            onClick={() => {
              setIsDropdown(false)
            }} 
          />
          <div className="absolute origin-top-right right-0 z-20 w-48">
            <div className="flex w-full overflow-hidden shadow-sm rounded-md ring-1 ring-[#1F1E35] bg-gradient-to-br from-[#1B1325] via-[#12111B] to-[#18132A] focus:outline-none">
              <div className="flex flex-col w-full divide-y divide-[#1F1E35]">
                {role === 'ADMIN' && (
                  <Link href="/">
                    <a className="inline-flex items-center space-x-2 p-3 font-light text-xs text-left cursor-pointer transition ease-in-out duration-200 hover:bg-[#1F1E35]">
                      <RiSettingsLine className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                      <span>Settings</span>
                    </a>
                  </Link>
                )}
                <Link href="/">
                  <a className="inline-flex items-center space-x-2 p-3 font-light text-xs text-left cursor-pointer transition ease-in-out duration-200 hover:bg-[#1F1E35]">
                    <RiFeedbackLine className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                    <span>Report</span>
                  </a>
                </Link>
                {/* the logic here is if the admin is only one they cannot leave unless it's more than 2 admins */}
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