import React from 'react'
import Spinner from '../../utils/Spinner'
import Profile from '../../components/Images/Profile'
import RoomImage from '../../components/Images/RoomImage'
import Members from './Members'
import Moment from 'react-moment'
import { useForm } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'
import { useGetJoinedRoom, useGetChats, useSendChatMutation } from '../../lib/ReactQuery'
import { RiSettingsLine, RiSendPlane2Line, RiSpyFill, RiEmotionSadLine } from 'react-icons/ri'

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

  const { mutate: optimisticChatMutation } = useSendChatMutation()

  const { handleSubmit, register, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>()

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
  }, [chatMainContainer, register, fetchNextPage, hasNextPage, inView])

  const onSendChat = async (formData: FormData) => {
    const userId = user.id
    const roomSlug = room.slug
    const chatbox = formData.chatbox
    const contentEditable = document.getElementById('contentEditable')

    if (contentEditable!.innerText.trim().length === 0 || chatbox === '') return

    optimisticChatMutation({ chatbox, userId, roomSlug })

    console.log(chats)

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

  if (getRoomLoading) {
    return (
      <div>Loading...</div>
    )
  }

  if (getRoomError) {
    return (
      <div>Error...</div>
    )
  }

  // get all users that joined in particular room
  const getJoinedUser = getRoom.joinedroom.map((join: any) => {
    return {
      userId: join.user.id,
      userImage: join.user.image,
      userName: join.user.name,
    }
  })

  // condition if the user is already joined in the room
  const matchJoinedUser = getJoinedUser.some((joinUser: any) => joinUser.userId === userId)
  
  return (
    <React.Fragment>
      {!matchJoinedUser && (
        <div className="flex flex-col w-full max-w-full h-full border-x border-[#1F1836]">
          <div className="inline-flex items-center justify-between w-full p-3 border-b border-[#1F1836] bg-gradient-to-r from-[#1F1E35] to-[#14121E]">
            <span className="inline-flex items-start w-full max-w-lg rounded-xl select-none">
              <div className="flex w-full max-w-[4rem] h-full max-h-[3.5rem]">
                {getRoom.photo
                  ? <RoomImage src={getRoom.photo} />
                  : <div className="p-4 w-50 h-50 rounded-xl object-cover bg-[#201A2C]">
                      <RiSpyFill className="w-5 h-5 text-[#4D38A2]" />
                    </div>
                }
              </div>
              <div className="block">
                <h3 className="font-light text-base">{ getRoom.name }</h3>
                <h3 className="font-light text-xs text-zinc-500">{ getRoom.description }</h3>
              </div>
            </span>
          </div>
          <div className="inline-flex items-center justify-center w-full h-full">
            {getRoom.privacy === 'Public' && (
              <div className="flex flex-col items-center w-full">
                <div className="flex flex-col">
                  <h1 className="font-rubikglitch text-3xl text-white lowercase">tomatochat</h1>
                  <h3 className="text-sm text-zinc-500">Welcome to TomatoChat. Discover the world of simplicity.</h3>
                </div>
              </div>
            )}
            {getRoom.privacy === 'Private' && (
              <div className="flex flex-col items-center w-full">
                <h2 className="font-bold text-xl">Private Room</h2>
              </div>
            )}
          </div>
        </div>
      )}
      {matchJoinedUser && (
        <div className="inline-flex w-full">
          <div className="flex flex-col w-full max-w-full h-full border-x border-[#1F1836]">
            <div className="inline-flex items-center justify-between w-full p-3 border-b border-[#1F1836] bg-gradient-to-r from-[#1F1E35] to-[#14121E]">
              <span className="inline-flex items-start w-full max-w-lg rounded-xl select-none">
                <div className="flex w-full max-w-[4rem] h-full max-h-[3.5rem]">
                  {getRoom.photo
                    ? <RoomImage src={getRoom.photo} />
                    : <div className="p-4 w-50 h-50 rounded-xl object-cover bg-[#201A2C]">
                        <RiSpyFill className="w-5 h-5 text-[#4D38A2]" />
                      </div>
                  }
                </div>
                <div className="block">
                  <h3 className="font-light text-base">{ getRoom.name }</h3>
                  <h3 className="font-light text-xs text-zinc-500">{ getRoom.description }</h3>
                </div>
              </span>
              <button
                title="Settings"
                type="button"
                className="outline-none"
              >
                <RiSettingsLine className="w-6 h-6 text-zinc-600 transition ease-in-out duration-200 transform hover:scale-90" />
              </button>
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
                    {chats && chats.pages.map((page: any) => (
                      <React.Fragment key={page.nextId ?? 'lastPage'}>
                        {page.chats.map((chat: { id: string, index: string, message: string, date: string, user: any }) => (
                          <React.Fragment key={chat.index}>
                            {chat.user.id !== user.id && (
                              <div className="flex items-end justify-start w-full space-x-2">
                                <div className="flex">
                                  <Profile src={chat.user.image} />
                                </div>
                                <div className="bubble-receiver inline w-full max-w-[15rem] p-3 font-light text-xs rounded-xl bg-[#19182B]">
                                  <p>{chat.message}</p>
                                  <span className="font-thin text-[9px]">
                                    <Moment date={chat.date} fromNow />
                                  </span>
                                </div>
                              </div>
                            )}
                            {chat.user.id === user.id && (
                              <div className="flex items-end justify-end w-full space-x-2">
                                <div className="bubble-sender inline w-full max-w-[15rem] p-3 font-light text-xs rounded-xl bg-[#4D38A2]">
                                  <p>{chat.message}</p>
                                  <span className="font-thin text-[9px]">
                                    <Moment date={chat.date} fromNow />
                                  </span>
                                </div>
                                <div className="flex">
                                  <Profile src={chat.user.image} />
                                </div>
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ))}
                    {isFetchingNextPage && <span className="font-light text-center text-sm text-[#1D9BF0]">Loading...</span>}
                    <section ref={ref} className="invisible" />
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
            <div className="w-full bg-gradient-to-br from-[#1B1325] via-[#12111B] to-[#18132A]">
              <form
                className="inline-flex w-full p-3 space-x-3"
                onSubmit={handleSubmit(onSendChat)}
              >
                <div
                  id="contentEditable"
                  className="w-full h-full max-h-[15rem] overflow-y-auto cursor-text whitespace-pre-wrap outline-none p-3 font-light text-xs rounded-xl bg-transparent border border-[#1F1836]"
                  placeholder="Write a message..."
                  title="Shift+Enter to execute new line."
                  contentEditable="true"
                  suppressContentEditableWarning
                  spellCheck={false}
                  onPaste={(e) => {
                    e.preventDefault()
                    var text = e.clipboardData.getData('text/plain')
                    document.execCommand('insertText', false, text)
                  }}
                  onKeyPress={handleLineBreak}
                  onClick={() => scrollToBottom(chatContainer)}
                  onInput={(e: any) => setValue('chatbox', e.currentTarget.textContent, { shouldValidate: true })}
                />
                <button
                  title="Send"
                  type="submit"
                  className="outline-none"
                >
                  <RiSendPlane2Line className="w-6 h-6 text-purple-600 transition ease-in-out duration-200 transform hover:scale-90" />
                </button>
              </form>
            </div>
          </div>
          <Members />
        </div>
      )}
    </React.Fragment>
  )
}

export default Chats