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

  const { handleSubmit, register, reset, formState: { isSubmitting, isSubmitSuccessful } } = useForm<FormData>()

  const onJoinPrivate = async (formData: FormData) => {
    const passcode = formData.passcode

    reset()
    
    // join private room function
    await joinPrivateRoomMutation.mutateAsync({
      slug: String(slug),
      userId: String(user.id),
      passcode: String(passcode)
    },
    {
      onError: async (error: any) => {
        toast.custom((trigger) => (
          <CustomToaster
            toast={toast}
            trigger={trigger}
            type={'Error'}
            message={`${ error }`}
          />
        ))
      },
      onSuccess: async () => {
        // send chat that the user is joined the room
        await sendChatJoinMutation.mutateAsync({
          chatbox: String(chatbox),
          userId: String(user.id),
          roomSlug: String(slug)
        })
        // send last chat after user leave the room
        await lastChat.mutateAsync({
          roomSlug: String(slug),
          lastChat: String(chatbox),
          lastChatType: 'JOIN',
          lastSentUserId: String(user.id),
          lastSentUserImage: String(user.image),
          lastSentUserName: String(user.name)
        })
      }
    })
  }

  return (
    <div className="flex flex-row items-center justify-center w-full h-full overflow-y-auto px-10 pt-10 pb-20 space-x-36">
      <div className="flex flex-col items-center lg:items-start w-full max-w-full lg:max-w-sm space-y-2">
        <h3 className="text-sm text-zinc-400 dark:text-white">Welcome to private server of</h3>
        <div className="flex flex-col items-center lg:items-start w-full">
          <h1 className="font-rubikglitch text-center text-6xl text-zinc-800 dark:text-white uppercase">{ name }</h1>
          <h3 className="text-sm text-zinc-600 dark:text-zinc-400">{ description }</h3>
          <form onSubmit={handleSubmit(onJoinPrivate)} className="flex flex-col w-full space-y-2 mt-5">
            <span className="inline-flex items-center w-full px-5 py-3 space-x-2 rounded-lg text-zinc-800 dark:text-zinc-400 bg-white dark:bg-tomato-dark-secondary border border-transparent focus-within:border-tomato-orange">
              <input
                type="password"
                className="w-full outline-none bg-transparent text-sm"
                placeholder="Enter Room Passcode"
                disabled={isSubmitSuccessful}
                {...register('passcode', { required: true })}
              />
              <RiKey2Line className="w-6 h-6" />
            </span>
            {(isSubmitting || isSubmitSuccessful) && (
              <div className="cursor-wait outline-none inline-flex items-center justify-center w-full space-x-2 px-2 py-3 rounded-md text-white bg-tomato-orange bg-opacity-80">
                <Spinner width={20} height={20} color={'#FFFFFF'} />
                <span>Joining...</span>
              </div>
            )}
            {!(isSubmitting || isSubmitSuccessful) && (
              <button
                title="Join"
                type="submit"
                className="outline-none w-full px-2 py-3 rounded-md text-white bg-tomato-orange transition ease-in-out duration-200 hover:bg-opacity-80"
                disabled={isSubmitSuccessful}
              >
                Join
              </button>
            )}
          </form>
        </div>
      </div>
      <RiSpyFill className="hidden lg:flex w-[20rem] h-[20rem] text-zinc-300 dark:text-tomato-orange dark:text-opacity-20" />
    </div>
  )
}

export default Private