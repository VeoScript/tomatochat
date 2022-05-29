import React from 'react'
import Spinner from '../../utils/Spinner'
import Profile from '../../components/Images/Profile'
import Seeners from '../../components/Images/Seeners'
import RoomImage from '../../components/Images/RoomImage'
import Members from './Members'
import Public from '../../components/Join/Public'
import Private from '../../components/Join/Private'
import ChatSettingMenu from '../../components/Menus/ChatSettingMenu'
import DeleteChat from '../../components/Modals/Body/DeleteChat'
import Moment from 'react-moment'
import { useForm } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'
import { useGetJoinedRoom, useGetChats, useSendChatMutation, useLastChatMutation, useSeenChatMutation } from '../../lib/ReactQuery'
import { RiMoreFill, RiSendPlane2Line, RiSpyFill, RiEmotionSadLine, RiCheckDoubleLine } from 'react-icons/ri'

interface IProps {
  user: any
  room: any
}

interface FormData {
  chatbox: string
}

const Chats: React.FC<IProps> = ({ user, room }) => {

  const { ref, inView } = useInView()

  const roomSlug = room.slug
  const userId = user.id

  const { data: getRoom, isLoading: getRoomLoading, isError: getRoomError } = useGetJoinedRoom(roomSlug)

  const { data: chats, isLoading: chatsLoading, isError: chatsError, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetChats(roomSlug)

  const seenChat = useSeenChatMutation()
  const { mutate: lastChat } = useLastChatMutation()
  const { mutate: optimisticChatMutation } = useSendChatMutation()

  const { handleSubmit, register, reset, setValue, formState: { isSubmitting } } = useForm<FormData>()

  const chatContainer = document.getElementById('chatContainer')
  const chatMainContainer = document.getElementById('chatMainContainer')

  const scrollToBottom = async (node: any) => {
    await node === null ? undefined : node.scrollTop = node.scrollHeight
  }

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
    scrollToBottom(chatMainContainer)
    register('chatbox', { required: true })
  }, [chatMainContainer, refetch, register, fetchNextPage, hasNextPage, inView])

  if (getRoomLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full space-y-2 border-l border-zinc-300 dark:border-[#1F1836]">
        <Spinner width={40} height={40} color={'#4D38A2'} />
        <h3 className="font-light text-xs">Loading...</h3>
      </div>
    )
  }

  if (getRoomError) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full space-y-2 text-zinc-400 border-l border-zinc-300 dark:border-[#1F1836]">
        <div className="inline-flex items-center justify-center w-full space-x-1 text-xs">
          <h3 className="font-bold text-3xl">THIS ROOM DOES NOT EXIST!</h3>
        </div>
      </div>
    )
  }

  // get all users that joined in particular room
  const getJoinedUser = getRoom.joinedroom.map((join: any) => {
    return {
      userId: join.user.id,
      userImage: join.user.image,
      userName: join.user.name,
      userRole: join.role
    }
  })

  // check if the user is already joined in the selected room
  const matchJoinedUser = getJoinedUser.some((joinUser: any) => joinUser.userId === userId)
  
  // get the room user role
  const getRole = getJoinedUser.find((joinUser: any) => joinUser.userId === userId)

  // get the last chat information
  const findJoinedRoom = getRoom.joinedroom.find((room: any) => room.user.id === userId)

  // get the last chat user id
  const getLastChat = chats && chats.pages[0].chats[0]

  const onSendChat = async (formData: FormData) => {
    const userId = user.id
    const roomSlug = room.slug
    const chatbox = formData.chatbox
    const contentEditable = document.getElementById('contentEditable')

    if (contentEditable!.innerText.trim().length === 0 || chatbox === '') return

    // send chat to the database
    optimisticChatMutation({
      chatbox,
      userId,
      roomSlug
    },
    {
      onSuccess() {
        lastChat({
          roomSlug: roomSlug,
          lastChat: chatbox,
          lastChatType: 'NORMAL',
          lastSentUserId: findJoinedRoom.user.id,
          lastSentUserImage: findJoinedRoom.user.image,
          lastSentUserName: findJoinedRoom.user.name
        },
        {
          onSuccess() {
            seenChat.mutate({
              joinedRoomId: findJoinedRoom.id
            })
          }
        })
      }
    })

    reset()

    scrollToBottom(chatContainer)

    contentEditable !== null ?
    contentEditable.innerHTML = '' : ''
    contentEditable?.focus()
  }

  const handleLineBreak = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(onSendChat)()
    }
  }
  
  return (
    <React.Fragment>
      {!matchJoinedUser && (
        <div className="flex flex-col w-full max-w-full h-full border-x border-zinc-300 dark:border-[#1F1836]">
          <div className="inline-flex items-center justify-between w-full p-3 border-b border-zinc-300 dark:border-[#1F1836] bg-white dark:bg-gradient-to-r dark:from-[#1F1E35] dark:to-[#14121E]">
            <span className="inline-flex items-start w-full max-w-lg rounded-xl select-none">
              <div className="flex w-full max-w-[4rem] h-full max-h-[3.5rem]">
                {getRoom.photo
                  ? <RoomImage src={getRoom.photo} />
                  : <div className="p-4 w-50 h-50 rounded-xl object-cover bg-zinc-200 dark:bg-[#201A2C]">
                      <RiSpyFill className="w-5 h-5 text-[#4D38A2]" />
                    </div>
                }
              </div>
              <div className="block">
                <h3 className="font-light text-base">{ getRoom.name }</h3>
                <h3 className="font-normal text-xs text-zinc-500">{ getRoom.description }</h3>
              </div>
            </span>
          </div>
          <div className="inline-flex items-center justify-center w-full h-full">
            {getRoom.privacy === 'Public' && (
              <Public
                user={user}
                slug={getRoom.slug}
                name={getRoom.name}
                description={getRoom.description}
              />
            )}
            {getRoom.privacy === 'Private' && (
              <Private
                user={user}
                slug={getRoom.slug}
                name={getRoom.name}
                description={getRoom.description}
              />
            )}
          </div>
        </div>
      )}
      {matchJoinedUser && (
        <div className="inline-flex w-full">
          <div className="flex flex-col w-full max-w-full h-full border-x border-zinc-300 dark:border-[#1F1836]">
            <div className="inline-flex items-center justify-between w-full p-3 border-b border-zinc-300 dark:border-[#1F1836] bg-white dark:bg-gradient-to-r dark:from-[#1F1E35] dark:to-[#14121E]">
              <span className="inline-flex items-start w-full max-w-lg rounded-xl select-none">
                <div className="flex w-full max-w-[4rem] h-full max-h-[3.5rem]">
                  {getRoom.photo
                    ? <RoomImage src={getRoom.photo} />
                    : <div className="p-4 w-50 h-50 rounded-xl object-cover bg-zinc-200 dark:[#201A2C]">
                        <RiSpyFill className="w-5 h-5 text-[#4D38A2]" />
                      </div>
                  }
                </div>
                <div className="block">
                  <h3 className="font-light text-base">{ getRoom.name }</h3>
                  <h3 className="font-normal text-xs text-[#CDA0F5]">{ getRoom.description }</h3>
                </div>
              </span>
              <div className="relative">
                <ChatSettingMenu
                  title="More"
                  room={getRoom}
                  getJoinedUser={getJoinedUser}
                  role={getRole.userRole}
                  user={user}
                  userId={userId}
                >
                  <RiMoreFill className="w-6 h-6 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
                </ChatSettingMenu>
              </div>
            </div>
            <div id="chatMainContainer" className="flex flex-col justify-end w-full h-full overflow-hidden">
              <div id="chatContainer" className="flex flex-col-reverse w-full space-y-reverse space-y-3 p-3 overflow-y-auto scroll-smooth">
                {chatsLoading && (
                  <div className="flex flex-col items-center justify-center w-full h-screen space-y-2">
                    <Spinner width={40} height={40} color={'#4D38A2'} />
                    <h3 className="font-light text-xs">Loading...</h3>
                  </div>
                )}
                {!chatsLoading && (
                  <React.Fragment>
                    {/* display the seen feature if the chat type is NORMAL */}
                    {getLastChat.chattype === 'NORMAL' && (
                      <div className="inline-flex w-full pl-10">
                        {getLastChat.user.id === userId && (
                          <div className="inline-flex items-center justify-end w-full space-x-1">
                            {getRoom.joinedroom.map((seeners: any, i: number) => 
                              <React.Fragment key={i}>
                                {(seeners.seen === true && seeners.user.id !== userId) && (
                                  <div className="flex">
                                    <Seeners src={seeners.user.image} />
                                  </div>
                                )}
                              </React.Fragment>
                            )}
                          </div>
                        )}
                        {getLastChat.user.id !== userId && (
                          <div className="inline-flex items-center justify-start w-full space-x-1">
                            {getRoom.joinedroom.map((seeners: any, i: number) => {
                              // check if the user is one of the seeners (kung ang user existing na sa mga niseen dili na sya dapat makita)...
                              var newSeeners = new Array({ seeners })
                              const findSeeners = newSeeners.some((set: any) => set.seeners.lastSentUserId !== getLastChat.user.id)
                              return (
                                <React.Fragment key={i}>
                                  {(seeners.seen === true && findSeeners === true) && (
                                    <div className="flex">
                                      <Seeners src={seeners.user.image} />
                                    </div>
                                  )}
                                </React.Fragment>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                    {chats && chats.pages.map((page: any, i: number) => (
                      <React.Fragment key={i}>
                        {page.chats.map((chat: { id: string, index: string, chattype: string, message: string, date: string, user: any }) => (
                          <React.Fragment key={chat.index}>
                            {/* if the type of chat is NORMAL this will be displaying as Bubble Chat */}
                            {chat.chattype === 'NORMAL' && (
                              <React.Fragment>
                                {chat.user.id !== user.id && (
                                  <div className="flex items-end justify-start w-full space-x-2">
                                    <div className="flex">
                                      <Profile src={chat.user.image} />
                                    </div>
                                    <div className="bubble-receiver flex flex-col w-full max-w-[15rem] space-y-1 p-3 font-normal text-xs rounded-xl whitespace-pre-wrap bg-zinc-100 dark:bg-[#19182B]">
                                      <p>{chat.message}</p>
                                      <span className="font-light dark:font-thin text-[9px]">
                                        <Moment date={chat.date} fromNow />
                                      </span>
                                    </div>
                                  </div>
                                )}
                                {chat.user.id === user.id && (
                                  <div className="flex items-end justify-end w-full space-x-2">
                                    <div className="bubble-sender flex flex-col w-full max-w-[15rem] space-y-1 p-3 font-normal text-xs rounded-xl whitespace-pre-wrap text-white bg-[#4D38A2]">
                                      <p>{chat.message}</p>
                                      <span className="inline-flex items-center space-x-2 font-thin text-[9px]">
                                        <Moment date={chat.date} fromNow />
                                        <div className="inline-flex items-center space-x-1">
                                          <RiCheckDoubleLine title="Sent" className="w-5 h-5 text-[#CDA0F5]" />
                                          <DeleteChat
                                            user={user}
                                            chatId={chat.id}
                                            roomSlug={roomSlug}
                                          />
                                        </div>
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </React.Fragment>
                            )}
                            {/* if the type of chat is JOIN this will be displaying as a normal text */}
                            {chat.chattype === 'JOIN' && (
                              <div className="flex flex-col items-center justify-center w-full space-x-2">
                                <p className="font-light text-xs text-zinc-400">{chat.message}</p>
                                <span className="font-light text-[10px] text-purple-800">
                                  <Moment date={chat.date} fromNow />
                                </span>
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ))}
                    <div className="inline-flex items-center justify-center w-full pb-3 text-sm text-white text-opacity-50">
                      <button
                        ref={ref}
                        onClick={() => fetchNextPage()}
                        disabled={!hasNextPage || isFetchingNextPage}
                      >
                        {isFetchingNextPage
                          ? <Spinner width={25} height={25} color={'#4D38A2'} />
                          : hasNextPage
                          ? 'Load Older Message'
                          : ''}
                      </button>
                    </div>
                  </React.Fragment>
                )}
                {chatsError && (
                  <div className="flex flex-col items-center justify-center w-full h-screen space-y-2 text-zinc-400">
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
              </div>
            </div>
            <div className="w-full border-t border-zinc-300 dark:border-transparent bg-white dark:bg-gradient-to-br dark:from-[#1B1325] dark:via-[#12111B] dark:to-[#18132A]">
              <form
                className="inline-flex w-full p-3 space-x-3"
                onSubmit={handleSubmit(onSendChat)}
              >
                <div
                  id="contentEditable"
                  className="w-full h-full max-h-[15rem] overflow-y-auto cursor-text whitespace-pre-wrap outline-none p-3 font-light text-xs rounded-xl bg-transparent border border-zinc-200 focus:border-zinc-400 dark:border-[#1F1836] dark:focus:border-[#2B214B]"
                  placeholder="Write a message..."
                  title="Shift+Enter to execute new line."
                  contentEditable="true"
                  suppressContentEditableWarning
                  spellCheck={false}
                  onFocus={() => {
                    seenChat.mutate({
                      joinedRoomId: findJoinedRoom.id
                    })
                  }}
                  onPaste={(e) => {
                    e.preventDefault()
                    var text = e.clipboardData.getData('text/plain')
                    document.execCommand('insertText', false, text)
                  }}
                  onKeyPress={handleLineBreak}
                  onClick={() => scrollToBottom(chatContainer)}
                  onInput={(e: any) => setValue('chatbox', e.currentTarget.textContent, { shouldValidate: true })}
                />
                {isSubmitting && (
                  <div className="w-6 h-6 py-2 outline-none cursor-wait">
                    <Spinner width={25} height={25} color={'#9333EA'} />
                  </div>
                )}
                {!isSubmitting && (
                  <button
                    title="Send"
                    type="submit"
                    className="outline-none"
                  >
                    <RiSendPlane2Line className="w-6 h-6 text-purple-600 transition ease-in-out duration-200 transform hover:scale-90" />
                  </button>
                )}
              </form>
            </div>
          </div>
          <Members
            userId={userId}
            roomSlug={roomSlug}
          />
        </div>
      )}
    </React.Fragment>
  )
}

export default Chats