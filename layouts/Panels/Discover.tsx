import React from 'react'
import RoomImage from '../../components/Images/RoomImage'
import { rooms } from '../../mock/rooms'
import { RiSearchLine } from 'react-icons/ri'

const DiscoverPanel = () => {
  return (
    <div className="flex flex-col w-full h-full overflow-hidden border-x border-[#1F1836]">
      <div className="inline-flex items-center justify-between w-full px-6 py-3 border-b border-[#1F1836] bg-gradient-to-r from-[#1F1E35] to-[#14121E]">
        <div className="block items-center w-full space-y-1 select-none">
          <h3 className="font-medium">Discover</h3>
          <p className="font-light text-xs">Join to start a conversation to everyone.</p>
        </div>
        <span className="inline-flex items-center w-full max-w-[19rem] px-3 py-2 space-x-2 rounded-lg text-zinc-400 bg-[#201A2C] border border-transparent focus-within:border-purple-600">
          <input
            type="text"
            className="w-full outline-none bg-transparent text-sm"
            placeholder="Search"
          />
          <RiSearchLine className="w-4 h-4" />
        </span>
      </div>
      <div className="flex flex-col w-full h-full p-3 overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {rooms.map((room: { avatar: string, name: string, description: string }, i: number) => (
          <div
            key={i}
            className="inline-flex w-full rounded-xl p-3 space-x-1 select-none hover:bg-gradient-to-r hover:from-[#1F1E35] hover:to-[#14121E]"
          >
            <div className="flex w-full max-w-[4rem] h-full max-h-[3.5rem]">
              <RoomImage src={room.avatar} />
            </div>
            <div className="inline-flex items-center justify-between w-full">
              <div className="block w-full max-w-xs space-y-1">
                <h3 className="font-light text-sm">{ room.name }</h3>
                <h3 className="font-light text-xs text-zinc-500">{ room.description }</h3>
              </div>
              <div className="inline-flex justify-end w-full max-w-xs space-x-3">
                <button
                  title="Settings"
                  type="button"
                  className="outline-none px-3 py-1 rounded-md text-xs bg-purple-800 transition ease-in-out duration-200 hover:bg-opacity-80"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DiscoverPanel