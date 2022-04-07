import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import RoomImage from '../../components/Images/RoomImage'
import { RiHome5Line, RiSearchLine, RiAddLine, RiCompass3Line } from 'react-icons/ri'
import { rooms } from '../../mock/rooms'

const Rooms = () => {

  const { pathname } = useRouter()

  return (
    <div className="flex flex-col w-full max-w-sm h-full overflow-hidden">
      <div className="flex flex-col w-full p-5 space-y-5">
        <div className="inline-flex items-center justify-between w-full">
          <h3 className="font-light">Rooms</h3>
          <span className="inline-flex items-center space-x-2">
            <Link href="/">
              <a
                title="Home"
                className="outline-none"
              >
                <RiHome5Line className={`${pathname === '/' ? 'text-zinc-400' : 'text-zinc-600'} w-6 h-6 transition ease-in-out duration-200 transform hover:scale-90`} />
              </a>
            </Link>
            <Link href="/discover">
              <a
                title="Discover"
                type="button"
                className="outline-none"
              >
                <RiCompass3Line className={`${pathname === '/discover' ? 'text-zinc-400' : 'text-zinc-600'} w-6 h-6 transition ease-in-out duration-200 transform hover:scale-90`} />
              </a>
            </Link>
            <button
              title="Create Room"
              type="button"
              className="outline-none"
            >
              <RiAddLine className="w-6 h-6 text-purple-500 transition ease-in-out duration-200 transform hover:scale-90" />
            </button>
          </span>
        </div>
        <div className="flex justify-center w-full">
          <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-400 bg-[#201A2C] border border-transparent focus-within:border-purple-600">
            <input
              type="text"
              className="w-full outline-none bg-transparent text-sm"
              placeholder="Search rooms"
            />
            <RiSearchLine className="w-4 h-4" />
          </span>
        </div>
      </div>
      <div className="inline-flex w-full overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <div className="flex flex-col w-full px-2">
          {rooms.map((room: { avatar: string, name: string, description: string }, i: number) => (
            <Link href="/room" key={i}>
              <a className="inline-flex w-full rounded-xl p-3 space-x-1 hover:bg-gradient-to-r hover:from-[#1F1E35] hover:to-[#14121E]">
                <div className="flex w-full max-w-[4rem] h-full max-h-[3.5rem]">
                  <RoomImage src={room.avatar} />
                </div>
                <div className="block space-y-1">
                  <h3 className="font-light text-sm">{ room.name }</h3>
                  <h3 className="font-light text-xs text-zinc-500">{ room.description }</h3>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Rooms