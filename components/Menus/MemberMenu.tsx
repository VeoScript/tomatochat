import React from 'react'
import Link from 'next/link'
import ChangeRole from '../Modals/Body/ChangeRole'
import KickOut from '../Modals/Body/KickOut'
import { RiUser3Line } from 'react-icons/ri'

interface IProps {
  children: any
  room: any
  role: string
  title: string
  memberUserId: string
  loggedInUserId: string
}

const MemberMenu: React.FC<IProps> = ({ room, children, role, title, memberUserId, loggedInUserId }) => {

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
          <div className="absolute right-0 z-20 w-48">
            <div className="flex w-full overflow-hidden shadow-sm rounded-md ring-1 ring-zinc-300 dark:ring-[#464A4D] bg-white dark:bg-tomato-dark-secondary focus:outline-none">
              <div className="flex flex-col w-full divide-y divide-zinc-300 dark:divide-[#464A4D]">
                <Link href={`/profile/${memberUserId}`}>
                  <a
                    className="inline-flex items-center space-x-2 p-3 font-light text-xs text-left cursor-pointer transition ease-in-out duration-200 hover:bg-zinc-100 dark:hover:bg-[#464A4D]"
                    onClick={() => {
                      setIsDropdown(false)
                    }} 
                  >
                    <RiUser3Line className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                    <span>View Profile</span>
                  </a>
                </Link>
                {(role === 'ADMIN') && (
                  <React.Fragment>
                    <ChangeRole
                      room={room}
                      role={role}
                      memberUserId={memberUserId}
                      loggedInUserId={loggedInUserId}
                    />
                    {/* the logic here is if the loggedin userId is the same as member userId this will be invisible */}
                    {memberUserId !== loggedInUserId && (
                      <KickOut
                        room={room}
                        memberUserId={memberUserId}
                        loggedInUserId={loggedInUserId}
                      />
                    )}
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default MemberMenu