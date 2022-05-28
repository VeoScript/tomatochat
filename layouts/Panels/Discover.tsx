import React from 'react'
import Router from 'next/router'
import SearchDiscover from '../../components/Search/SearchDiscover'
import RoomImage from '../../components/Images/RoomImage'
import Spinner from '../../utils/Spinner'
import { useInView } from 'react-intersection-observer'
import { useGetRooms, useGetSearchDiscover } from '../../lib/ReactQuery'
import { RiSpyFill, RiEmotionSadLine, RiLockFill } from 'react-icons/ri'

interface IProps {
  user: any
}

const DiscoverPanel: React.FC<IProps> = ({ user }) => {

  const { ref, inView } = useInView()
  
  // state for search functions
  const [searchTerm, setSearchTerm] = React.useState('')
  const [isDisplay, setIsDisplay] = React.useState(false)
  
  const { data: rooms, isLoading, isError, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetRooms()
  const { data: searchDiscover, isLoading: searchDiscoverLoading, isError: searchDiscoverError } = useGetSearchDiscover(searchTerm)

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, inView])

  const searchResults = !searchTerm ? searchDiscover : searchDiscover?.filter((discover: any) => 
    discover.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
  )
  
  return (
    <div className="flex flex-col w-full h-full overflow-hidden border-x border-zinc-300 dark:border-[#1F1836]">
      <div className="inline-flex items-center justify-between w-full px-6 py-3 border-b border-zinc-300 dark:border-[#1F1836] bg-white dark:bg-gradient-to-r dark:from-[#1F1E35] dark:to-[#14121E]">
        <div className="block items-center w-full space-y-1 select-none">
          <h3 className="font-medium">Discover</h3>
          <p className="font-light text-xs">Join to start a conversation to everyone.</p>
        </div>
        <SearchDiscover
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setIsDisplay={setIsDisplay}        
        />
      </div>
      <div className="flex flex-col w-full h-full p-3 overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {/* Search Result Display */}
        {isDisplay && (
          <React.Fragment>
            {searchDiscoverLoading && (
              <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
                <Spinner width={50} height={50} color={'#4D38A2'} />
                <h3 className="font-light text-sm">Loading...</h3>
              </div>
            )}
            {searchDiscoverError && (
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
            {!searchDiscoverLoading && (
              <React.Fragment>
                {searchResults.map((room: { photo: string, name: string, slug: string, description: string, privacy: string, joinedroom: any }, i: number) => {
                      
                  // get all rooms
                  const checkRoom = room.joinedroom.map((join: any) => {
                    return {
                      userId: join.userId,
                    }
                  })

                  // check if the room is already joined by the user
                  const existRoom = checkRoom.some((joinUser: any) => joinUser.userId === user.id)

                  return (
                    <React.Fragment key={i}>
                      {!existRoom && (
                        <div
                          className="inline-flex w-full rounded-xl p-3 space-x-1 select-none hover:bg-zinc-100 dark:hover:bg-gradient-to-r dark:hover:from-[#1F1E35] dark:hover:to-[#14121E]"
                        >
                          <div className="flex w-full max-w-[4rem] h-full max-h-[3.5rem]">
                            {room.photo
                              ? <RoomImage src={room.photo} />
                              : <div className="p-4 w-50 h-50 rounded-xl object-cover bg-zinc-200 dark:bg-[#201A2C]">
                                  <RiSpyFill className="w-5 h-5 text-[#4D38A2]" />
                                </div>
                            }
                          </div>
                          <div className="inline-flex items-center justify-between w-full">
                            <div className="block w-full max-w-xs space-y-1">
                              <span className="inline-flex items-center space-x-2">
                                <h3 className="font-light text-sm">{ room.name }</h3>
                                {room.privacy === 'Private' && <RiLockFill className="w-3 h-3 text-purple-500" />}
                              </span>
                              <h3 className="font-light text-xs text-zinc-500">{ room.description }</h3>
                            </div>
                            <div className="inline-flex justify-end w-full max-w-xs space-x-3">
                              <button
                                title="Join"
                                type="button"
                                className="outline-none px-3 py-2 rounded-md text-xs text-white bg-purple-800 transition ease-in-out duration-200 hover:bg-opacity-80"
                                onClick={() => {
                                  Router.push(`${room.slug}`)
                                }}
                              >
                                Join
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  )
                })}
              </React.Fragment>
            )}
          </React.Fragment>
        )}
        {/* Display All Rooms */}
        {!isDisplay && (
          <React.Fragment>
            {isLoading && (
              <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
                <Spinner width={50} height={50} color={'#4D38A2'} />
                <h3 className="font-light text-sm">Loading...</h3>
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
                {rooms && rooms.pages[0].rooms.length === 0 && (
                  <div className="inline-flex items-center justify-center w-full max-w-full h-full">
                    <div className="flex flex-col">
                      <h1 className="font-rubikglitch text-3xl text-zinc-800 dark:text-white lowercase">tomatochat</h1>
                      <h3 className="text-sm text-zinc-500">Welcome to TomatoChat. Discover the world of simplicity.</h3>
                    </div>
                  </div>
                )}
                {rooms && rooms.pages.map((page: any, i: number) => (
                  <React.Fragment key={i}>
                    {page.rooms.map((room: { photo: string, name: string, slug: string, description: string, privacy: string, joinedroom: any }, i: number) => {
                      
                      // get all rooms
                      const checkRoom = room.joinedroom.map((join: any) => {
                        return {
                          userId: join.userId,
                        }
                      })

                      // check if the room is already joined by the user
                      const existRoom = checkRoom.some((joinUser: any) => joinUser.userId === user.id)

                      return (
                        <React.Fragment key={i}>
                          {!existRoom && (
                            <div
                              className="inline-flex w-full rounded-xl p-3 space-x-1 select-none hover:bg-zinc-100 dark:hover:bg-gradient-to-r dark:hover:from-[#1F1E35] dark:hover:to-[#14121E]"
                            >
                              <div className="flex w-full max-w-[4rem] h-full max-h-[3.5rem]">
                                {room.photo
                                  ? <RoomImage src={room.photo} />
                                  : <div className="p-4 w-50 h-50 rounded-xl object-cover bg-zinc-200 dark:bg-[#201A2C]">
                                      <RiSpyFill className="w-5 h-5 text-[#4D38A2]" />
                                    </div>
                                }
                              </div>
                              <div className="inline-flex items-center justify-between w-full">
                                <div className="block w-full max-w-xs space-y-1">
                                  <span className="inline-flex items-center space-x-2">
                                    <h3 className="font-light text-sm">{ room.name }</h3>
                                    {room.privacy === 'Private' && <RiLockFill className="w-3 h-3 text-purple-500" />}
                                  </span>
                                  <h3 className="font-light text-xs text-zinc-500">{ room.description }</h3>
                                </div>
                                <div className="inline-flex justify-end w-full max-w-xs space-x-3">
                                  <button
                                    title="Join"
                                    type="button"
                                    className="outline-none px-3 py-2 rounded-md text-xs text-white bg-purple-800 transition ease-in-out duration-200 hover:bg-opacity-80"
                                    onClick={() => {
                                      Router.push(`${room.slug}`)
                                    }}
                                  >
                                    Join
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      )
                    })}
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
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

export default DiscoverPanel