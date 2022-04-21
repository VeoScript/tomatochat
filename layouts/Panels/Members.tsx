import React from 'react'
import Spinner from '../../utils/Spinner'
import MemberMenu from '../../components/Menus/MemberMenu'
import MemberImage from '../../components/Images/MemberImage'
import { useGetMembers } from '../../lib/ReactQuery'
import { RiMore2Fill, RiEmotionSadLine } from 'react-icons/ri'

interface IProps {
  userId: string
  roomSlug: string
}

const Members: React.FC<IProps> = ({ userId, roomSlug }) => {

  const { data: members, isLoading: getMembersLoading, isError: getMembersError, refetch } = useGetMembers(roomSlug)

  if (getMembersLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full space-y-2 border-l border-[#1F1836]">
        <Spinner width={40} height={40} color={'#4D38A2'} />
        <h3 className="font-light text-xs">Loading...</h3>
      </div>
    )
  }

  if (getMembersError) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full space-y-2 text-zinc-400 border-l border-[#1F1836]">
        <RiEmotionSadLine className="w-14 h-14" />
        <div className="inline-flex items-center justify-center w-full space-x-1 text-xs">
          <h3 className="font-light">Failed to load, try to</h3>
          <button
            type="button"
            className="outline-none font-bold text-[#6b50d8] hover:underline"
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
    <div className="flex flex-col w-full max-w-sm h-full">
      <div className="inline-flex items-center justify-between w-full p-5">
        <h3 className="font-light">Participants</h3>
      </div>
      <div className="inline-flex w-full h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <div className="flex flex-col w-full px-2 space-y-2">
          {checkUserMembers !== undefined && <h3 className="font-semibold text-xs text-zinc-500 px-3 uppercase">Members</h3> }
          {members.map((member: { id: string, index: string, role: string, user: any }, i: number) => (
            <React.Fragment key={i}>
              {member.role === 'USER' && (
                <div className="inline-flex w-full rounded-xl p-3 space-x-1 select-none hover:bg-gradient-to-r hover:from-[#1F1E35] hover:to-[#14121E]">
                  <div className="flex w-full max-w-[4rem] h-full max-h-[3.5rem]">
                    <MemberImage src={member.user.image} />
                  </div>
                  <div className="inline-flex items-center justify-between w-full">
                    <div className="block w-full max-w-xs space-y-1">
                      <h3 className="font-light text-sm">{ member.user.name }</h3>
                      <h3 className="font-light text-xs text-zinc-500">{ member.user.email }</h3>
                    </div>
                    <div className="inline-flex justify-end w-full max-w-xs space-x-3">
                      <MemberMenu
                        title={'More'}
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
          ))}
          {checkAdminMembers !== undefined && <h3 className="font-semibold text-xs text-zinc-500 px-3 uppercase">Admins</h3> }
          {members.map((member: { id: string, index: string, role: string, user: any }, i: number) => (
            <React.Fragment key={i}>
              {member.role === 'ADMIN' && (
                <div className="inline-flex w-full rounded-xl p-3 space-x-1 select-none hover:bg-gradient-to-r hover:from-[#1F1E35] hover:to-[#14121E]">
                  <div className="flex w-full max-w-[4rem] h-full max-h-[3.5rem]">
                    <MemberImage src={member.user.image} />
                  </div>
                  <div className="inline-flex items-center justify-between w-full space-x-3">
                    <div className="block w-full max-w-xs space-y-1">
                      <h3 className="font-light text-sm">{ member.user.name }</h3>
                      <h3 className="font-light text-xs text-zinc-500">{ member.user.email }</h3>
                    </div>
                    <div className="inline-flex justify-end w-full max-w-xs space-x-3">
                      <MemberMenu
                        title="More"
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
          ))}
        </div>
      </div>
    </div>
  )
}

export default Members