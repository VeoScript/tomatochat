import React from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Spinner from '../../utils/Spinner'
import Profile from '../../components/Images/Profile'
import Seeners from '../../components/Images/Seeners'
import RoomImage from '../../components/Images/RoomImage'
import Members from './Members'
import Public from '../../components/Join/Public'
import Private from '../../components/Join/Private'
import ViewImage from '../../components/Modals/Body/ViewImage'
import ChatSettingMenu from '../../components/Menus/ChatSettingMenu'
import DeleteChat from '../../components/Modals/Body/DeleteChat'
import ChatUpload from '../../components/Uploads/ChatUpload'
import CustomToaster from '../../components/CustomToaster'
import Moment from 'react-moment'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'
import { useGetJoinedRoom, useGetChats, useSendChatMutation, useSendChatImageMutation, useLastChatMutation, useSeenChatMutation } from '../../lib/ReactQuery'
import { RiMoreFill, RiSendPlane2Line, RiSpyFill, RiEmotionSadLine, RiCheckDoubleLine, RiCloseFill } from 'react-icons/ri'

interface IProps {
  user: any
  room: any
}

interface FormData {
  chatbox: string
}

const imageTypeRegex = /image\/(png|jpg|jpeg)/gm

const Chats: React.FC<IProps> = ({ user, room }) => {

  const router = useRouter()

  const { ref, inView } = useInView()

  const roomSlug = room.slug
  const userId = user.id

  const { data: getRoom, isLoading: getRoomLoading, isError: getRoomError } = useGetJoinedRoom(roomSlug)

  const { data: chats, isLoading: chatsLoading, isError: chatsError, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetChats(roomSlug)

  const seenChat = useSeenChatMutation()
  const { mutateAsync: lastChat } = useLastChatMutation()
  const { mutateAsync: sendChatMutation } = useSendChatMutation()
  const { mutateAsync: sendChatImageMutation } = useSendChatImageMutation()

  // for upload image message states
  const [chatImageFiles, setChatImageFiles] = React.useState<any>([])
  const [chatImages, setChatImages] = React.useState<any>([])

  const { handleSubmit, register, reset, setValue, formState: { isSubmitting } } = useForm<FormData>()
  const { handleSubmit: handleSubmitPhoto, formState: { isSubmitting: isSubmittingPhoto } } = useForm()

  const chatContainer = document.getElementById('chatContainer')

  const scrollToBottom = async (node: any) => {
    await node === null ? undefined : node.scrollTop = node.scrollHeight
  }

  // useEffect for inifinite scroll and register the chatbox chat input text to react-hook-form
  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    } 
    register('chatbox', { required: true })
  }, [refetch, register, fetchNextPage, hasNextPage, inView])

  // useEffect for setting to default after changing the url route
  React.useEffect(() => {
    const contentEditable = document.getElementById('contentEditable')
    contentEditable !== null ?
    contentEditable.innerHTML = '' : ''
    contentEditable?.focus()
    scrollToBottom(chatContainer)
  },[chatContainer, router.asPath])

  // useEffect for sending a photos in chatbox
  React.useEffect(() => {
    const images: any[] = []
    const fileReaders: FileReader[] = []
    let isCancel = false

    if (chatImageFiles.length) {
      chatImageFiles.forEach((file: any) => {
        const fileReader = new FileReader()
        fileReaders.push(fileReader)

        fileReader.onload = (e: any) => {
          const { result } = e.target

          if (result) {
            images.push(result)
          }

          if (images.length === chatImageFiles.length && !isCancel) {
            setChatImages(images)
          }
        }
        fileReader.readAsDataURL(file)
      })
    }

    return () => {
      isCancel = true
      fileReaders.forEach(fileReader => {
        if (fileReader.readyState === 1) {
          fileReader.abort()
        }
      })
    }
  }, [chatImageFiles])

  if (getRoomLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full space-y-2 border-l border-zinc-300 dark:border-tomato-dark-secondary">
        <Spinner width={40} height={40} color={'#F16506'} />
        <h3 className="font-light text-xs">Loading...</h3>
      </div>
    )
  }

  if (getRoomError) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full space-y-2 text-zinc-400 border-l border-zinc-300 dark:border-tomato-dark-secondary">
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

  // get selected image for upload
  const handleAddImage = (e: any) => {
    const { files } = e.target
    const validImagesFiles = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (file.type.match(imageTypeRegex)) {
        validImagesFiles.push(file)
      } else {
        toast.custom((trigger) => (
          <CustomToaster
            toast={toast}
            trigger={trigger}
            type={'Error'}
            message={'Please select jpg, jpeg or png only!'}
          />
        ))
        return
      }

      if(file.size > 2097152) {
        setChatImages([])
        setChatImageFiles([])
        toast.custom((trigger) => (
          <CustomToaster
            toast={toast}
            trigger={trigger}
            type={'Info'}
            message={'Selected photo size exceeds 2 MB. Choose another one.'}
          />
        ))
        return
      }
    }

    if (validImagesFiles.length > 4) {
      toast.custom((trigger) => (
        <CustomToaster
          toast={toast}
          trigger={trigger}
          type={'Info'}
          message={'Only up to 4 photos can be uploaded.'}
        />
      ))
      return
    }

    if (validImagesFiles.length) {
      setChatImageFiles(validImagesFiles)
      return
    }
  }

  // send chat with images
  const onSendPhotos = async () => {
    try {
      let photo = new Array
      
      // check if there is selected photo, hence it will upload it to the gallery hosting
      if (chatImageFiles || chatImages) {
        const body = new FormData()

        // uploading multiple images
        for (let i = 0; i < chatImageFiles.length; i++) {
          body.append('image', chatImageFiles[i])

          await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API}`, {
            method: 'POST',
            body: body
          })
          .then((response) => response.json())
          .then((result) => {
            photo.push(result.data.url)
          })
          .catch((err) => {
            console.log(err)
            toast.custom((trigger) => (
              <CustomToaster
                toast={toast}
                trigger={trigger}
                type={'Error'}
                message={'Upload failed. Check your internet.'}
              />
            ))
            return
          })
        }
      }

      // for sending all of the selected images to database
      for (let i = 0; i < photo.length; i++) {
        await sendChatImageMutation({
          chatbox: String(photo[i]),
          userId,
          roomSlug
        },
        {
          onError: async (err) => {
            console.log(err)
          },
          onSuccess: async () => {
            const chatbox = `${user.name} send a photo.`

            await lastChat({
              roomSlug: roomSlug,
              lastChat: String(chatbox),
              lastChatType: 'IMAGE',
              lastSentUserId: findJoinedRoom.user.id,
              lastSentUserImage: findJoinedRoom.user.image,
              lastSentUserName: findJoinedRoom.user.name
            },
            {
              onSuccess: async () => {
                await seenChat.mutateAsync({
                  joinedRoomId: findJoinedRoom.id
                })
              }
            })
          }
        })
      }

      setChatImages([])
      setChatImageFiles([])
      reset()
      
    } catch(err) {
      console.error(err)
    }
  }

  // send chat function
  const onSendChat = async (formData: FormData) => {
    const userId = user.id
    const roomSlug = room.slug
    const chatbox = formData.chatbox
    const contentEditable = document.getElementById('contentEditable')

    if (contentEditable!.innerText.trim().length === 0 || chatbox === '') return

    // send chat to the database
    await sendChatMutation({
      chatbox,
      userId,
      roomSlug
    },
    {
      onSuccess: async () => {
        await lastChat({
          roomSlug: roomSlug,
          lastChat: chatbox,
          lastChatType: 'NORMAL',
          lastSentUserId: findJoinedRoom.user.id,
          lastSentUserImage: findJoinedRoom.user.image,
          lastSentUserName: findJoinedRoom.user.name
        },
        {
          onSuccess: async () => {
            await seenChat.mutateAsync({
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
        <div className="flex flex-col w-full max-w-full h-full px-3 border-x border-zinc-300 dark:border-tomato-dark-secondary">
          <div className="inline-flex items-center justify-between w-full p-3 border-b border-zinc-300 dark:border-tomato-dark-secondary rounded-b-xl back-shadow bg-tomato-light-secondary dark:bg-tomato-dark backdrop-blur-xl dark:backdrop-blur-sm bg-opacity-80">
            <span className="inline-flex items-start w-full max-w-lg rounded-xl select-none">
              <div className="flex w-full max-w-[4rem] h-full max-h-[3.5rem]">
                {getRoom.photo
                  ? <RoomImage src={getRoom.photo} />
                  : <div className="p-4 w-50 h-50 rounded-xl object-cover bg-zinc-200 dark:bg-[#161818]">
                      <RiSpyFill className="w-5 h-5 text-tomato-orange" />
                    </div>
                }
              </div>
              <div className="block">
                <h3 className="font-bold text-base">{ getRoom.name }</h3>
                <h3 className="font-normal text-[13px] text-zinc-500">{ getRoom.description }</h3>
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
          <div className="flex flex-col w-full max-w-full h-full border-x border-zinc-300 dark:border-tomato-dark-secondary">
            <div className="relative z-20 flex items-center w-full px-2">
              <div className="flex flex-row items-center justify-between w-full p-3 border-b border-zinc-300 dark:border-tomato-dark-secondary rounded-b-xl back-shadow bg-tomato-light-secondary dark:bg-tomato-dark backdrop-blur-xl dark:backdrop-blur-sm bg-opacity-80">
                <span className="inline-flex items-start w-full max-w-lg rounded-xl select-none">
                  <div className="flex w-full max-w-[4rem] h-full max-h-[3.5rem]">
                    {getRoom.photo
                      ? <RoomImage src={getRoom.photo} />
                      : <div className="p-4 w-50 h-50 rounded-xl object-cover bg-zinc-200 dark:bg-[#161818]">
                          <RiSpyFill className="w-5 h-5 text-tomato-orange" />
                        </div>
                    }
                  </div>
                  <div className="block">
                    <h3 className="font-bold text-base">{ getRoom.name }</h3>
                    <h3 className="font-normal text-[13px] text-zinc-500">{ getRoom.description }</h3>
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
            </div>
            <div id="chatMainContainer" className="flex flex-col justify-end w-full h-full overflow-hidden">
              <div id="chatContainer" className="flex flex-col-reverse w-full space-y-reverse space-y-3 p-3 overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                {chatsLoading && (
                  <div className="flex flex-col items-center justify-center w-full h-screen space-y-2">
                    <Spinner width={40} height={40} color={'#F16506'} />
                    <h3 className="font-light text-xs">Loading...</h3>
                  </div>
                )}
                {!chatsLoading && (
                  <React.Fragment>
                    {/* display the seen feature if the chat type is NORMAL or IMAGE */}
                    {getLastChat && (getLastChat.chattype === 'NORMAL' || getLastChat.chattype === 'IMAGE') && (
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
                                    <div className="bubble-receiver flex flex-col w-full max-w-[15rem] space-y-1 p-3 font-normal text-xs rounded-xl whitespace-pre-wrap bg-white dark:bg-tomato-dark-secondary">
                                      <p>{chat.message}</p>
                                      <span className="font-light dark:font-thin text-[9px]">
                                        <Moment date={chat.date} fromNow />
                                      </span>
                                    </div>
                                  </div>
                                )}
                                {chat.user.id === user.id && (
                                  <div className="flex items-end justify-end w-full space-x-2">
                                    <div className="bubble-sender flex flex-col w-full max-w-[15rem] space-y-1 p-3 font-normal text-xs rounded-xl whitespace-pre-wrap text-white bg-[#464A4D] dark:bg-[#161818]">
                                      <p>{chat.message}</p>
                                      <span className="inline-flex items-center space-x-2 font-thin text-[9px]">
                                        <Moment date={chat.date} fromNow />
                                        <div className="inline-flex items-center space-x-1">
                                          <RiCheckDoubleLine title="Sent" className="w-5 h-5 text-blue-400" />
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
                                <span className="font-light text-[10px] text-tomato-orange">
                                  <Moment date={chat.date} fromNow />
                                </span>
                              </div>
                            )}
                            {chat.chattype === 'IMAGE' && (
                              <React.Fragment>
                                {chat.user.id !== user.id && (
                                  <div className="flex items-end justify-start w-full space-x-2">
                                    <div className="flex">
                                      <Profile src={chat.user.image} />
                                    </div>
                                    <div className="bubble-receiver flex flex-col w-full max-w-[15rem] space-y-1 p-3 font-normal text-xs rounded-xl whitespace-pre-wrap bg-white dark:bg-tomato-dark-secondary">
                                      <ViewImage
                                        imageURL={chat.message}
                                      />
                                      <span className="font-light dark:font-thin text-[9px]">
                                        <Moment date={chat.date} fromNow />
                                      </span>
                                    </div>
                                  </div>
                                )}
                                {chat.user.id === user.id && (
                                  <div className="flex items-end justify-end w-full space-x-2">
                                    <div className="bubble-sender flex flex-col w-full max-w-[15rem] space-y-1 p-3 font-normal text-xs rounded-xl whitespace-pre-wrap text-white bg-[#464A4D] dark:bg-[#161818]">
                                      <ViewImage
                                        imageURL={chat.message}
                                      />
                                      <span className="inline-flex items-center space-x-2 font-thin text-[9px]">
                                        <Moment date={chat.date} fromNow />
                                        <div className="inline-flex items-center space-x-1">
                                          <RiCheckDoubleLine title="Sent" className="w-5 h-5 text-blue-400" />
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
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ))}
                    <div className="inline-flex items-center justify-center w-full pb-3 text-xs text-tomato-orange">
                      <button
                        ref={ref}
                        onClick={() => fetchNextPage()}
                        disabled={!hasNextPage || isFetchingNextPage}
                      >
                        {isFetchingNextPage
                          ? <Spinner width={25} height={25} color={'#F16506'} />
                          : hasNextPage
                          ? 'Load older messages...'
                          : ''}
                      </button>
                    </div>
                  </React.Fragment>
                )}
                {chatsError && (
                  <div className="flex flex-col items-center justify-center w-full h-screen space-y-2 text-zinc-400">
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
              </div>
            </div>
            <div className="w-full -space-y-2 border-t border-zinc-300 dark:border-transparent bg-transparent dark:bg-tomato-dark-slight">
              {chatImageFiles.length > 0 && (
                <div className="flex items-center justify-center w-full p-2 space-x-1">
                  {chatImages.map(( image: any, i: number ) => {
                    return (
                      <div className="relative" key={i}>
                        {!isSubmittingPhoto && (
                          <button
                            title="Remove"
                            type="button"
                            className="absolute top-1 right-1 z-30 p-1 rounded-full bg-black bg-opacity-80 hover:bg-opacity-50"
                            onClick={() => {
                              // for deleting specific photo
                              let previewImages = chatImages.map((photo: any) => photo).indexOf(image)
                              let toUploadImages = chatImageFiles.map((photo: any) => photo.name).indexOf(image)
                              if (previewImages > -1 || toUploadImages > -1) {
                                chatImages.splice(previewImages, 1)
                                chatImageFiles.splice(toUploadImages, 1)
                                setChatImages(chatImages)
                                setChatImageFiles(chatImageFiles)
                              }
                            }}
                          >
                            <RiCloseFill className="w-4 h-4 text-white" />
                          </button>
                        )}
                        <Image
                          src={image}
                          blurDataURL={image}
                          width={300}
                          height={300}
                          className="rounded-md object-cover"
                          layout="intrinsic"
                          quality={100}
                          alt="Post Images"
                        />
                      </div>
                    )
                  })}
                </div>
              )}
              <form
                className="inline-flex items-start w-full p-3 space-x-3"
                onSubmit={handleSubmit(onSendChat)}
              >
                <ChatUpload
                  handleAddImage={handleAddImage}
                />
                {chatImageFiles.length > 0 && (
                  <div className="inline-flex items-start justify-between w-full space-x-2">
                    {!isSubmittingPhoto && (
                      <button
                        title="Send Photo"
                        type="button"
                        className="outline-none w-full p-2 rounded-lg text-sm text-white bg-tomato-orange transition ease-in-out duration-200 hover:bg-opacity-80"
                        onClick={handleSubmitPhoto(onSendPhotos)}
                      >
                        Send
                      </button>
                    )}
                    {isSubmittingPhoto && (
                      <div className="inline-flex items-center justify-center w-full space-x-2 p-2 cursor-wait rounded-lg text-sm text-white bg-tomato-orange bg-opacity-80">
                        <Spinner
                          width={20}
                          height={20}
                          color={'#FFFFFF'}
                        />
                        <span className="font-light">Sending...</span>
                      </div>
                    )}
                  </div>
                )}
                {chatImageFiles.length == 0 && (
                  <>
                    <div
                      id="contentEditable"
                      className="w-full h-full max-h-[15rem] overflow-y-auto cursor-text whitespace-pre-wrap outline-none p-3 font-light text-xs rounded-xl bg-white dark:bg-tomato-dark border border-zinc-200 focus:border-zinc-400 dark:border-transparent dark:focus:border-tomato-orange"
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
                        <Spinner width={25} height={25} color={'#F16506'} />
                      </div>
                    )}
                    {!isSubmitting && (
                      <button
                        title="Send"
                        type="submit"
                        className="outline-none"
                      >
                        <RiSendPlane2Line className="w-6 h-6 mt-2 text-tomato-orange transition ease-in-out duration-200 transform hover:scale-90" />
                      </button>
                    )}
                  </>
                )}
              </form>
            </div>
          </div>
          <Members
            user={user}
            userId={userId}
            roomSlug={roomSlug}
          />
        </div>
      )}
    </React.Fragment>
  )
}

export default Chats