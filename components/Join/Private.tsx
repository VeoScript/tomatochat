import React from 'react'
import Spinner from '../../utils/Spinner'
import CustomToaster from '../CustomToaster'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useJoinPrivateRoomMutation, useSendChatJoinMutation, useLastChatMutation } from '../../lib/ReactQuery'
import { RiSpyFill, RiKey2Line } from 'react-icons/ri'

interface IProps {
  user: any,
  slug: string,
  name: string,
  description: string
}

interface FormData {
  passcode: string
}

const Private: React.FC<IProps> = ({ user, slug, name, description }) => {

  const joinPrivateRoomMutation =  useJoinPrivateRoomMutation()
  const sendChatJoinMutation = useSendChatJoinMutation()
  const lastChat = useLastChatMutation()

  const chatbox = `${user.name} join the room.`

  const { handleSubmit, register, reset, formState: { isSubmitting } } = useForm<FormData>()

  const onJoinPrivate = async (formData: FormData) => {
    const passcode = formData.passcode
    
    // join private room function
    await joinPrivateRoomMutation.mutate({
      slug: String(slug),
      userId: String(user.id),
      passcode: String(passcode)
    },
    {
      onError(error: any) {
        toast.custom((trigger) => (
          <CustomToaster
            toast={toast}
            trigger={trigger}
            type={'Error'}
            message={`${ error }`}
          />
        ))
      },
      onSuccess() {
        // send chat that the user is joined the room
        sendChatJoinMutation.mutate({
          chatbox: String(chatbox),
          userId: String(user.id),
          roomSlug: String(slug)
        })
        // send last chat after user leave the room
        lastChat.mutate({
          roomSlug: String(slug),
          lastChat: String(chatbox),
          lastChatType: 'JOIN',
          lastSentUserId: String(user.id),
          lastSentUserImage: String(user.image),
          lastSentUserName: String(user.name)
        })
      }
    })

    reset()
  }

  return (
    <div className="flex flex-row items-center justify-center w-full h-full overflow-y-auto px-10 pt-10 pb-20 space-x-36">
      <div className="flex flex-col items-start w-full max-w-sm space-y-2">
        <h3 className="text-sm text-zinc-400 dark:text-white">Welcome to private server of</h3>
        <div className="flex flex-col w-full">
          <h1 className="font-rubikglitch text-6xl text-zinc-800 dark:text-white uppercase">{ name }</h1>
          <h3 className="text-sm text-zinc-600 dark:text-zinc-400">{ description }</h3>
          <form onSubmit={handleSubmit(onJoinPrivate)} className="flex flex-col w-full space-y-2 mt-5">
            <span className="inline-flex items-center w-full px-5 py-3 space-x-2 rounded-lg text-zinc-800 dark:text-zinc-400 bg-white dark:bg-[#201A2C] border border-zinc-300 dark:border-transparent focus-within:border-purple-600 dark:focus-within:border-purple-600">
              <input
                type="password"
                className="w-full outline-none bg-transparent text-sm"
                placeholder="Enter Room Passcode"
                {...register('passcode', { required: true })}
              />
              <RiKey2Line className="w-6 h-6" />
            </span>
            {isSubmitting && (
              <div className="cursor-wait outline-none inline-flex items-center justify-center w-full space-x-2 px-2 py-3 rounded-md bg-purple-800 bg-opacity-80">
                <Spinner width={20} height={20} color={'#FFFFFF'} />
                <span>Joining...</span>
              </div>
            )}
            {!isSubmitting && (
              <button
                title="Join"
                type="submit"
                className="outline-none w-full px-2 py-3 rounded-md text-white bg-purple-800 transition ease-in-out duration-200 hover:bg-opacity-80"
              >
                Join
              </button>
            )}
          </form>
        </div>
      </div>
      <RiSpyFill className="w-[20rem] h-[20rem] text-zinc-300 dark:text-[#1F1E35]" />
    </div>
  )
}

export default Private