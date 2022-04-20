import React from 'react'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import Spinner from '../../utils/Spinner'
import RoomImage from '../../components/Images/RoomImage'
import CreateRoom from '../../components/Modals/CreateRoom'
import { useInView } from 'react-intersection-observer'
import { useGetJoinedRooms } from '../../lib/ReactQuery'
import { RiHome5Line, RiSearchLine, RiCompass3Line, RiSpyFill, RiChat3Line, RiEmotionSadLine } from 'react-icons/ri'

interface IProps {
  user: any
}

const Rooms: React.FC<IProps> = ({ user }) => {

  const userId = user.id

  const { pathname, asPath } = useRouter()

  const { ref, inView } = useInView()
  
  const { data: joined_rooms, isLoading, isError, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetJoinedRooms(userId)

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, inView])

  return (
    <div className="flex flex-col w-full max-w-sm h-full overflow-hidden">
      <div className="flex flex-col w-full p-5 space-y-5">
        <div className="inline-flex items-center justify-between w-full">
          <h3 className="font-light">My Rooms</h3>
          <span className="inline-flex items-center space-x-2">
            <Link href="/">
              <a
                title="Home"
                className="outline-none"
              >
                <RiHome5Line className={`${pathname === '/' ? 'text-zinc-400' : 'text-zinc-600'} w-6 h-6 transition ease-in-out duration-200 transform hover:scale-90`} />
              </a>
            </Link>
            <button
              title="Discover"
              type="button"
              className="outline-none"
              onClick={() => {
                Router.push('/discover', undefined, { shallow: true })
              }}
            >
              <RiCompass3Line className={`${pathname === '/discover' ? 'text-zinc-400' : 'text-zinc-600'} w-6 h-6 transition ease-in-out duration-200 transform hover:scale-90`} />
            </button>
            <CreateRoom user={user} />
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
      <div className="inline-flex w-full h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <div className="flex flex-col w-full px-2 space-y-2">
          {isLoading && (
            <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
              <Spinner width={40} height={40} color={'#4D38A2'} />
              <h3 className="font-light text-xs">Loading...</h3>
            </div>
          )}
          {isError && (
            <div className="flex flex-col items-center justify-center w-full h-full space-y-2 text-zinc-400">
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
          )}
          {!isLoading && (
            <React.Fragment>
              {joined_rooms && joined_rooms.pages[0].joined_rooms.length === 0 && (
                <div className="inline-flex items-center justify-center w-full max-w-full h-full">
                  <div className="flex flex-col items-center w-full space-y-3">
                    <div className="flex flex-col items-center space-y-2 text-zinc-400">
                      <RiChat3Line className="w-14 h-14" />
                      <h3 className="font-light text-xs">No conversation available.</h3>
                    </div>
                    <Link href="/discover">
                      <a className="w-[12rem] p-2 rounded-md text-center text-sm bg-purple-800 transition ease-in-out duration-200 hover:bg-opacity-80">
                        Discover
                      </a>
                    </Link>
                  </div>
                </div>
              )}
              {joined_rooms && joined_rooms.pages.map((page: any) => (
                <React.Fragment key={page.nextId ?? 'lastPage'}>
                  {page.joined_rooms.map((joined_room: { room: any }, i: number) => (
                    <button
                      key={i}
                      type="button"
                      className={`inline-flex text-left w-full rounded-xl p-3 space-x-1 ${asPath === `/${joined_room.room.slug}` && 'bg-gradient-to-r from-[#1F1E35] to-[#14121E]'} hover:bg-gradient-to-r hover:from-[#1F1E35] hover:to-[#14121E] focus:bg-gradient-to-r focus:from-[#1F1E35] focus:to-[#14121E]`}
                      onClick={() => {
                        Router.replace(`/${joined_room.room.slug}`)
                      }}
                    >
                      <div className="flex w-full max-w-[4rem] h-full max-h-[3.5rem]">
                        {joined_room.room.photo
                          ? <RoomImage src={joined_room.room.photo} />
                          : <div className="p-4 w-50 h-50 rounded-xl object-cover bg-[#201A2C]">
                              <RiSpyFill className="w-5 h-5 text-[#4D38A2]" />
                            </div>
                        }
                      </div>
                      <div className="block space-y-1">
                        <h3 className="font-light text-sm">{ joined_room.room.name }</h3>
                        <h3 className="font-light text-xs text-zinc-500">{ joined_room.room.description }</h3>
                      </div>
                    </button>
                  ))}
                </React.Fragment>
              ))}
              {isFetchingNextPage && (
                <div className="inline-flex justify-center w-full p-3">
                  <Spinner width={30} height={30} color={'#4D38A2'} />
                </div>
              )}
              <details ref={ref} className="invisible">
                Intersecrion Observer Marker
              </details>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  )
}

export default Rooms