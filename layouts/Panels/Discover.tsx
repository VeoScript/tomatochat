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

  const searchResults = !searchTerm ? searchDiscover : searchDiscover?.filter((room: any) => 
    room.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
  )
  
  return (
    <div className="flex flex-col w-full h-full px-3 overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between w-full space-y-3 md:space-y-0 px-6 py-3 rounded-b-xl back-shadow bg-transparent dark:bg-gradient-to-r dark:from-[#33383B] dark:to-[#222526]">
        <div className="flex flex-col items-center md:items-start w-full space-y-1 select-none">
          <h3 className="font-medium">Discover</h3>
          <p className="font-light text-xs">Join to start a conversation to everyone.</p>
        </div>
        <SearchDiscover
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setIsDisplay={setIsDisplay}        
        />
      </div>
      <div className="flex flex-col w-full h-full py-3 space-y-2 overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {/* Search Result Display */}
        {isDisplay && (
          <React.Fragment>
            {searchDiscoverLoading && (
              <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
                <Spinner width={50} height={50} color={'#F16506'} />
                <h3 className="font-light text-sm">Loading...</h3>
              </div>
            )}
            {searchDiscoverError && (
              <div className="flex flex-col items-center justify-center w-full h-full space-y-2 text-zinc-400">
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
                          className="inline-flex w-full rounded-xl p-3 space-x-1 select-none back-shadow hover:bg-white dark:hover:bg-gradient-to-r dark:hover:from-[#33383B] dark:hover:to-[#222526]"
                        >
                          <div className="flex items-start w-full max-w-[4rem] h-full max-h-[3.5rem]">
                            {room.photo
                              ? <RoomImage src={room.photo} />
                              : <div className="p-4 w-50 h-50 rounded-xl object-cover bg-zinc-200 dark:bg-[#161818]">
                                  <RiSpyFill className="w-5 h-5 text-[#F16506]" />
                                </div>
                            }
                          </div>
                          <div className="inline-flex items-center justify-between w-full">
                            <div className="block w-full max-w-xs space-y-1">
                              <span className="inline-flex items-center space-x-2">
                                <h3 className="font-light text-sm">{ room.name }</h3>
                                {room.privacy === 'Private' && <RiLockFill className="w-3 h-3 text-tomato-orange" />}
                              </span>
                              <h3 className="font-light text-xs text-zinc-500 line-clamp-5">{ room.description }</h3>
                              <span className="flex items-center mt-1 space-x-3">
                                <p className="font-bold text-[11px] text-zinc-500">
                                  {room.joinedroom.length}&nbsp;
                                  {room.joinedroom.length === 1 ? 'Participant' : 'Participants'}
                                </p>
                              </span>
                            </div>
                            <div className="inline-flex justify-end w-full max-w-xs space-x-3">
                              <button
                                title="Join"
                                type="button"
                                className="outline-none px-3 py-2 rounded-md text-xs text-white bg-tomato-orange transition ease-in-out duration-200 hover:bg-opacity-80"
                                onClick={() => {
                                  Router.push(`/room/${room.slug}`)
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
                <Spinner width={50} height={50} color={'#F16506'} />
                <h3 className="font-light text-sm">Loading...</h3>
              </div>
            )}
            {isError && (
              <div className="flex flex-col items-center justify-center w-full h-full space-y-2 text-zinc-400">
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
            )}
            {!isLoading && (
              <React.Fragment>
                {rooms && rooms.pages[0].rooms.length === 0 && (
                  <div className="inline-flex items-center justify-center w-full max-w-full h-full">
                    <div className="flex flex-col">
                      <h1 className="font-rubikglitch text-3xl text-tomato-lavender dark:text-white lowercase">tomatochat</h1>
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
                              className="inline-flex w-full rounded-xl p-3 space-x-1 select-none back-shadow hover:bg-white dark:hover:bg-gradient-to-r dark:hover:from-[#33383B] dark:hover:to-[#222526]"
                            >
                              <div className="flex items-start w-full max-w-[4rem] h-full max-h-[3.5rem]">
                                {room.photo
                                  ? <RoomImage src={room.photo} />
                                  : <div className="p-4 w-50 h-50 rounded-xl object-cover bg-zinc-200 dark:bg-[#161818]">
                                      <RiSpyFill className="w-5 h-5 text-[#F16506]" />
                                    </div>
                                }
                              </div>
                              <div className="inline-flex items-center justify-between w-full">
                                <div className="block w-full max-w-xs space-y-1">
                                  <span className="inline-flex items-center space-x-2">
                                    <h3 className="font-light text-sm">{ room.name }</h3>
                                    {room.privacy === 'Private' && <RiLockFill className="w-3 h-3 text-tomato-orange" />}
                                  </span>
                                  <h3 className="font-light text-xs text-zinc-500 line-clamp-5">{ room.description }</h3>
                                  <span className="flex items-center mt-1 space-x-3">
                                    <p className="font-bold text-[11px] text-zinc-500">
                                      {room.joinedroom.length}&nbsp;
                                      {room.joinedroom.length === 1 ? 'Participant' : 'Participants'}
                                    </p>
                                  </span>
                                </div>
                                <div className="inline-flex justify-end w-full max-w-xs space-x-3">
                                  <button
                                    title="Join"
                                    type="button"
                                    className="outline-none px-3 py-2 rounded-md text-xs text-white bg-tomato-orange transition ease-in-out duration-200 hover:bg-opacity-80"
                                    onClick={() => {
                                      Router.push(`/room/${room.slug}`)
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
                <div className="inline-flex items-center justify-center w-full pb-3 text-xs text-tomato-orange">
                  <button
                    ref={ref}
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                  >
                    {isFetchingNextPage
                      ? <Spinner width={40} height={40} color={'#F16506'} />
                      : hasNextPage
                      ? 'Load more...'
                      : ''}
                  </button>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

export default DiscoverPanel