import React from 'react'
import Spinner from '../../utils/Spinner'
import MemberMenu from '../../components/Menus/MemberMenu'
import MemberImage from '../../components/Images/MemberImage'
import NavBarProfileMenu from '../../components/NavBar/NavBarProfileMenu'
import { useGetMembers } from '../../lib/ReactQuery'
import { RiCheckboxBlankCircleFill, RiMore2Fill, RiEmotionSadLine } from 'react-icons/ri'

interface IProps {
  user: any
  userId: string
  roomSlug: string
}

const Members: React.FC<IProps> = ({ user, userId, roomSlug }) => {

  const { data: members, isLoading: getMembersLoading, isError: getMembersError, refetch } = useGetMembers(roomSlug)

  if (getMembersLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
        <Spinner width={40} height={40} color={'#F16506'} />
        <h3 className="font-light text-xs">Loading...</h3>
      </div>
    )
  }

  if (getMembersError) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
        <RiEmotionSadLine className="w-14 h-14 text-tomato-orange text-opacity-50" />
        <div className="inline-flex items-center justify-center w-full space-x-1 text-xs">
          <h3 className="font-light">Failed to load, try to</h3>
          <button
            type="button"
            className="outline-none font-bold text-tomato-orange hover:underline"
            onClick={() => refetch()}
          >
            Reload
          </button>
        </div>
      </div>
    )
  }

  const getRoles = members.map((member: any) => {
    return {
      role: member.role,
      userId: member.user.id
    }
  })

  const checkRole = getRoles.find((member: any) => member.userId === userId)
  const checkAdminMembers = getRoles.find((member: any) => member.role === 'ADMIN')
  const checkUserMembers = getRoles.find((member: any) => member.role === 'USER')

  return (
    <div className="hidden lg:flex flex-col w-full max-w-sm h-full">
      <NavBarProfileMenu user={user} />
      <div className="inline-flex items-center justify-between w-full p-5">
        <h3 className="font-bold">Participants</h3>
      </div>
      <div className="inline-flex w-full h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
        <div className="flex flex-col w-full px-2 space-y-2">
          {checkAdminMembers !== undefined && <h3 className="font-semibold text-xs text-zinc-500 px-3 uppercase">Admins</h3> }
          {members.map((member: { id: string, index: string, role: string, user: any }, i: number) => {
            //check if the admin participants are online
            const onlineUsers = member.user.sessions.some((online: { userId: string }) => online.userId === member.user.id)
            return (
              <React.Fragment key={i}>
                {member.role === 'ADMIN' && (
                  <div className="inline-flex w-full rounded-xl p-3 space-x-1 back-shadow select-none hover:bg-white dark:hover:bg-gradient-to-r dark:hover:from-[#33383B] dark:hover:to-[#222526]">
                    <div className="flex w-full max-w-[4rem] h-full max-h-[3.5rem]">
                      <MemberImage src={member.user.image} />
                    </div>
                    <div className="inline-flex items-center justify-between w-full space-x-3">
                      <div className="block w-full max-w-xs space-y-1">
                        <div className="inline-flex items-center space-x-2">
                          <h3 className="font-light text-sm">{ member.user.name }</h3>
                          {onlineUsers && (
                            <RiCheckboxBlankCircleFill className="w-2 h-2 text-green-400"/>
                          )}
                        </div>
                        <h3 className="font-light text-xs text-zinc-500">{ member.user.email }</h3>
                      </div>
                      <div className="relative inline-flex justify-end w-full max-w-xs space-x-3">
                        <MemberMenu
                          title="More"
                          room={members}
                          role={checkRole && checkRole.role} 
                          memberUserId={member.user.id}
                          loggedInUserId={userId}
                        >
                          <RiMore2Fill className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                        </MemberMenu>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            )
          })}
          {checkUserMembers !== undefined && <h3 className="font-semibold text-xs text-zinc-500 px-3 uppercase">Members</h3> }
          {members.map((member: { id: string, index: string, role: string, user: any }, i: number) => {
            //check if the normal participants are online
            const onlineUsers = member.user.sessions.some((online: { userId: string }) => online.userId === member.user.id)
            return (
              <React.Fragment key={i}>
                {member.role === 'USER' && (
                  <div className="inline-flex w-full rounded-xl p-3 space-x-1 back-shadow select-none hover:bg-white dark:hover:bg-gradient-to-r dark:hover:from-[#33383B] dark:hover:to-[#222526]">
                    <div className="flex w-full max-w-[4rem] h-full max-h-[3.5rem]">
                      <MemberImage src={member.user.image} />
                    </div>
                    <div className="inline-flex items-center justify-between w-full">
                      <div className="block w-full max-w-xs space-y-1">
                        <div className="inline-flex items-center justify-start space-x-2">
                          <h3 className="font-light text-sm">{ member.user.name }</h3>
                          {onlineUsers && (
                            <RiCheckboxBlankCircleFill className="w-2 h-2 text-green-400"/>
                          )}
                        </div>
                        <h3 className="font-light text-xs text-zinc-500">{ member.user.email }</h3>
                      </div>
                      <div className="relative inline-flex justify-end w-full max-w-xs space-x-3">
                        <MemberMenu
                          title={'More'}
                          room={members}
                          role={checkRole && checkRole.role}
                          memberUserId={member.user.id}
                          loggedInUserId={userId}
                        >
                          <RiMore2Fill className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                        </MemberMenu>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Members