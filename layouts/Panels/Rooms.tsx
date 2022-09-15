import React from 'react'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import Spinner from '../../utils/Spinner'
import SearchInbox from '../../components/Search/SearchInbox'
import RoomImage from '../../components/Images/RoomImage'
import CreateRoom from '../../components/Modals/Body/CreateRoom'
import { useInView } from 'react-intersection-observer'
import { useGetJoinedRooms, useGetSearchInbox, useSeenChatMutation } from '../../lib/ReactQuery'
import { RiHome5Line, RiCompass3Line, RiSpyFill, RiChat3Line, RiEmotionSadLine, RiLockFill, RiBubbleChartFill } from 'react-icons/ri'

interface IProps {
  user: any
}

const Rooms: React.FC<IProps> = ({ user }) => {

  const seenChat = useSeenChatMutation()

  const userId = user.id

  const { pathname, asPath } = useRouter()

  const { ref, inView } = useInView()
  
  // state for search functions
  const [searchTerm, setSearchTerm] = React.useState('')
  const [isDisplay, setIsDisplay] = React.useState(false)
  
  const { data: joined_rooms, isLoading, isError, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetJoinedRooms(userId)
  const { data: searchInbox, isLoading: searchInboxLoading, isError: searchInboxError } = useGetSearchInbox(searchTerm, userId)

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, inView])

  return (
    <div className="hidden md:flex flex-col w-full max-w-xs lg:max-w-sm h-full overflow-hidden">
      <div className="flex w-full px-1 py-5">
        <div className="flex flex-col w-full p-2 space-y-5 rounded-xl back-shadow">
          <div className="inline-flex items-center justify-between w-full">
            <h3 className="font-bold">Inbox</h3>
            <span className="inline-flex items-center space-x-2">
              <Link href="/">
                <a
                  title="Home"
                  className="outline-none"
                >
                  <RiHome5Line className={`${pathname === '/' ? 'text-tomato-orange' : 'text-zinc-500'} w-6 h-6 transition ease-in-out duration-200 transform hover:scale-90`} />
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
                <RiCompass3Line className={`${pathname === '/discover' ? 'text-tomato-orange' : 'text-zinc-500'} w-6 h-6 transition ease-in-out duration-200 transform hover:scale-90`} />
              </button>
              <CreateRoom user={user} />
            </span>
          </div>
          {joined_rooms?.pages[0].joined_rooms.length > 0 && (
            <div className="flex justify-center w-full">
              <SearchInbox
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setIsDisplay={setIsDisplay}
              />
            </div>
          )}
        </div>
      </div>
      <div className="inline-flex w-full h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
        {/* Search Result Display Inbox */}
        {isDisplay && (
          <div className="flex flex-col w-full px-2 space-y-2">
            {searchInboxLoading && (
              <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
                <Spinner width={40} height={40} color={'#F16506'} />
                <h3 className="font-light text-xs">Loading...</h3>
              </div>
            )}
            {searchInboxError && (
              <div className="flex flex-col items-center justify-center w-full h-full space-y-2 text-zinc-400">
                <RiEmotionSadLine className="w-14 h-14" />
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
            {!searchInboxLoading && (
              <React.Fragment>
                {searchInbox.map((joined_room: { id: string, seen: boolean, lastChat: string, lastChatType: string, lastSentUserName: string, lastSentDate: string, room: any, index: number }) => {
                  return (
                    <button
                      key={joined_room.index}
                      type="button"
                      className={`inline-flex items-start justify-between text-left w-full rounded-xl p-3 space-x-3 back-shadow ${asPath === `/room/${joined_room.room.slug}` && 'bg-white dark:bg-gradient-to-r dark:from-[#33383B] dark:to-[#222526]'} hover:bg-white focus:bg-white dark:hover:bg-gradient-to-r dark:hover:from-[#33383B] dark:hover:to-[#222526] dark:focus:bg-gradient-to-r dark:focus:from-[#33383B] dark:focus:to-[#222526]`}
                      onClick={() => {
                        Router.replace(`/room/${joined_room.room.slug}`)
                        seenChat.mutate({
                          joinedRoomId: joined_room.id
                        })
                      }}
                    >
                      <div className="inline-flex w-full h-full space-x-2">
                        <div className="flex items-start w-full max-w-[4rem] h-full max-h-[3.5rem]">
                          {joined_room.room.photo
                            ? <RoomImage src={joined_room.room.photo} />
                            : <div className="p-4 w-50 h-50 rounded-xl object-cover bg-zinc-200 dark:bg-[#161818]">
                                <RiSpyFill className="w-5 h-5 text-[#F16506]" />
                              </div>
                          }
                        </div>
                        <div className="block w-full space-y-1">
                          <div className="inline-flex items-center space-x-2">
                            <h3 className="font-light text-sm">{ joined_room.room.name }</h3>
                            {joined_room.room.privacy === 'Private' && <RiLockFill className="w-3 h-3 text-tomato-orange" />}
                          </div>
                          {/* check if the last chat is null (if null it will display the room description otherwise, it will displaying the last chat of the room...) */}
                          {joined_room.lastChat === null
                            ? (
                                <h3 className="text-xs text-zinc-400 line-clamp-2">{ joined_room.room.description }</h3>
                              )
                            : (
                                <React.Fragment>
                                  {(joined_room.lastChatType === 'JOIN' || joined_room.lastChatType === 'IMAGE') && (
                                    <div className="inline-block text-xs text-zinc-400 line-clamp-2">
                                      { joined_room.lastChat }
                                    </div>
                                  )}
                                  {joined_room.lastChatType === 'NORMAL' && (
                                    <div className="inline-block text-xs text-zinc-400 line-clamp-2">
                                      <span className="text-tomato-orange">{ joined_room.lastSentUserName }: &nbsp;</span>
                                      { joined_room.lastChat }
                                    </div>
                                  )}
                                </React.Fragment>
                              )
                          }
                        </div>
                      </div>
                      {joined_room.seen === false && (
                        <span className="inline-flex items-center h-full pl-3">
                          <RiBubbleChartFill className="w-5 h-5 text-tomato-orange" />
                        </span>
                      )}
                    </button>
                  )
                })}
              </React.Fragment>
            )}
          </div>
        )}
        {/* Display All Joined Room in Inbox */}
        {!isDisplay && (
          <div className="flex flex-col w-full px-2 space-y-2">
            {isLoading && (
              <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
                <Spinner width={40}  height={40} color={'#F16506'} />
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
                {joined_rooms && joined_rooms.pages[0].joined_rooms.length === 0 && (
                  <div className="inline-flex items-center justify-center w-full max-w-full h-full">
                    <div className="flex flex-col items-center w-full space-y-3">
                      <div className="flex flex-col items-center space-y-2 text-zinc-400">
                        <RiChat3Line className="w-14 h-14" />
                        <h3 className="font-light text-xs">Your inbox is empty.</h3>
                      </div>
                      <Link href="/discover">
                        <a className="w-[12rem] p-2 rounded-md text-center text-sm text-white bg-tomato-orange transition ease-in-out duration-200 hover:bg-opacity-80">
                          Discover
                        </a>
                      </Link>
                    </div>
                  </div>
                )}
                {joined_rooms && joined_rooms.pages.map((page: any, i: number) => (
                  <React.Fragment key={i}>
                    {page.joined_rooms.map((joined_room: { id: string, seen: boolean, lastChat: string, lastChatType: string, lastSentUserName: string, lastSentDate: string, room: any, index: number }) => {
                      return (
                        <button
                          key={joined_room.index}
                          type="button"
                          className={`inline-flex items-start justify-between text-left w-full rounded-xl p-3 space-x-3 back-shadow ${asPath === `/room/${joined_room.room.slug}` && 'bg-white dark:bg-gradient-to-r dark:from-[#33383B] dark:to-[#222526]'} hover:bg-white focus:bg-white dark:hover:bg-gradient-to-r dark:hover:from-[#33383B] dark:hover:to-[#222526] dark:focus:bg-gradient-to-r dark:focus:from-[#33383B] dark:focus:to-[#222526]`}
                          onClick={() => {
                            Router.push(`/room/${joined_room.room.slug}`)
                            seenChat.mutate({
                              joinedRoomId: joined_room.id
                            })
                          }}
                        >
                          <div className="inline-flex w-full h-full space-x-2">
                            <div className="flex items-start w-full max-w-[4rem] h-full max-h-[3.5rem]">
                              {joined_room.room.photo
                                ? <RoomImage src={joined_room.room.photo} />
                                : <div className="p-4 w-50 h-50 rounded-xl object-cover bg-zinc-300 dark:bg-[#161818]">
                                    <RiSpyFill className="w-5 h-5 text-[#F16506]" />
                                  </div>
                              }
                            </div>
                            <div className="block w-full space-y-1">
                              <div className="inline-flex items-center space-x-2">
                                <h3 className="font-light text-sm">{ joined_room.room.name }</h3>
                                {joined_room.room.privacy === 'Private' && <RiLockFill className="w-3 h-3 text-tomato-orange" />}
                              </div>
                              {/* check if the last chat is null (if null it will display the room description otherwise, it will displaying the last chat of the room...) */}
                              {joined_room.lastChat === null
                                ? (
                                    <h3 className="text-xs text-tomato-orange line-clamp-2">{ joined_room.room.description }</h3>
                                  )
                                : (
                                    <React.Fragment>
                                      {(joined_room.lastChatType === 'JOIN' || joined_room.lastChatType === 'IMAGE') && (
                                        <div className="inline-block text-xs text-zinc-400 line-clamp-2">
                                          { joined_room.lastChat }
                                        </div>
                                      )}
                                      {joined_room.lastChatType === 'NORMAL' && (
                                        <div className="inline-block text-xs text-zinc-400 line-clamp-2">
                                          <span className="text-tomato-orange">{ joined_room.lastSentUserName }: &nbsp;</span>
                                          { joined_room.lastChat }
                                        </div>
                                      )}
                                    </React.Fragment>
                                  )
                              }
                            </div>
                          </div>
                          {joined_room.seen === false && (
                            <span className="inline-flex items-center h-full pl-3">
                              <RiBubbleChartFill className="w-5 h-5 text-tomato-orange" />
                            </span>
                          )}
                        </button>
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
          </div>
        )}
      </div>
    </div>
  )
}

export default Rooms