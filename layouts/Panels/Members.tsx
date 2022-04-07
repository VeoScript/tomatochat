import React from 'react'
import Link from 'next/link'
import MemberImage from '../../components/Images/MemberImage'
import { RiUser3Line, RiLogoutBoxLine, RiSettingsLine } from 'react-icons/ri'
import { members } from '../../mock/members'

const Members = () => {
  return (
    <div className="flex flex-col w-full max-w-sm h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-400 scrollbar-track-zinc-600">
      <div className="inline-flex items-center justify-between w-full p-5">
        <h3 className="font-light">Participants</h3>
      </div>
      <div className="inline-flex w-full overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <div className="flex flex-col w-full px-2 space-y-2">
          <h3 className="font-semibold text-xs text-zinc-500 px-3 uppercase">Members</h3>
          {members.map((member: { avatar: string, name: string, role: string, shortbio: string }, i: number) => (
            <React.Fragment key={i}>
              {member.role === 'User' && (
                <div className="inline-flex w-full rounded-xl p-3 space-x-1 select-none hover:bg-gradient-to-r hover:from-[#1F1E35] hover:to-[#14121E]">
                  <div className="flex w-full max-w-[4rem] h-full max-h-[3.5rem]">
                    <MemberImage src={member.avatar} />
                  </div>
                  <div className="inline-flex items-center justify-between w-full">
                    <div className="block w-full max-w-xs space-y-1">
                      <h3 className="font-light text-sm">{ member.name }</h3>
                      <h3 className="font-light text-xs text-zinc-500">{ member.shortbio }</h3>
                    </div>
                    <div className="inline-flex justify-end w-full max-w-xs space-x-3">
                      <Link href="/username">
                        <a
                          title="Profile"
                          type="button"
                          className="outline-none"
                        >
                          <RiUser3Line className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                        </a>
                      </Link>
                      <button
                        title="Settings"
                        type="button"
                        className="outline-none"
                      >
                        <RiSettingsLine className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                      </button>
                      <button
                        title="Kickout"
                        type="button"
                        className="outline-none"
                      >
                        <RiLogoutBoxLine className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
          <h3 className="font-semibold text-xs text-zinc-500 px-3 uppercase">Admins</h3>
          {members.map((member: { avatar: string, name: string, role: string, shortbio: string }, i: number) => (
            <React.Fragment key={i}>
              {member.role === 'Admin' && (
                <div className="inline-flex w-full rounded-xl p-3 space-x-1 select-none hover:bg-gradient-to-r hover:from-[#1F1E35] hover:to-[#14121E]">
                  <div className="flex w-full max-w-[4rem] h-full max-h-[3.5rem]">
                    <MemberImage src={member.avatar} />
                  </div>
                  <div className="inline-flex items-center justify-between w-full">
                    <div className="block w-full max-w-xs space-y-1">
                      <h3 className="font-light text-sm">{ member.name }</h3>
                      <h3 className="font-light text-xs text-zinc-500">{ member.shortbio }</h3>
                    </div>
                    <div className="inline-flex justify-end w-full max-w-xs space-x-3">
                      <Link href="/username">
                        <a
                          title="Profile"
                          type="button"
                          className="outline-none"
                        >
                          <RiUser3Line className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                        </a>
                      </Link>
                      <button
                        title="Settings"
                        type="button"
                        className="outline-none"
                      >
                        <RiSettingsLine className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                      </button>
                      <button
                        title="Kickout"
                        type="button"
                        className="outline-none"
                      >
                        <RiLogoutBoxLine className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                      </button>
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