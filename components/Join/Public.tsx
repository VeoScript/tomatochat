import React from 'react'
import Spinner from '../../utils/Spinner'
import CustomToaster from '../CustomToaster'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useJoinPublicRoomMutation, useSendChatJoinMutation, useLastChatMutation } from '../../lib/ReactQuery'
import { RiEarthLine } from 'react-icons/ri'

interface IProps {
  user: any,
  slug: string,
  name: string,
  description: string
}

const Public: React.FC<IProps> = ({ user, slug, name, description }) => {

  const joinPublicRoomMutation = useJoinPublicRoomMutation()
  const sendChatJoinMutation = useSendChatJoinMutation()
  const lastChat = useLastChatMutation()

  const chatbox = `${user.name} join the room.`

  const { handleSubmit, formState: { isSubmitting } } = useForm()

  const onJoinPublic = async () => {
    // join public room function
    await joinPublicRoomMutation.mutate({
      slug: String(slug),
      userId: String(user.id)
    },
    {
      onError() {
        toast.custom((trigger) => (
          <CustomToaster
            toast={toast}
            trigger={trigger}
            type={'Error'}
            message={'There is an error while joining in Public Room. Check your internet'}
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
  }

  return (
    <div className="flex flex-row items-center justify-center w-full h-full p-10 space-x-36">
      <div className="flex flex-col items-start w-full max-w-sm space-y-2">
        <h3 className="text-sm text-zinc-400 dark:text-white">Welcome to public server of</h3>
        <div className="flex flex-col w-full">
          <h1 className="font-rubikglitch text-6xl text-zinc-800 dark:text-white uppercase">{ name }</h1>
          <h3 className="text-sm text-zinc-600 dark:text-zinc-400">{ description }</h3>
          <div className="flex flex-col w-full space-y-3 mt-5">
            {isSubmitting && (
              <div className="cursor-wait outline-none inline-flex items-center justify-center w-full space-x-2 px-2 py-3 rounded-md bg-purple-800 bg-opacity-80">
                <Spinner width={20} height={20} color={'#FFFFFF'} />
                <span>Joining...</span>
              </div>
            )}
            {!isSubmitting && (
              <button
                title="Join"
                type="button"
                className="outline-none w-full px-2 py-3 rounded-md text-white bg-purple-800 transition ease-in-out duration-200 hover:bg-opacity-80"
                onClick={handleSubmit(onJoinPublic)}
              >
                Join
              </button>
            )}
          </div>
        </div>
      </div>
      <RiEarthLine className="w-[20rem] h-[20rem] text-zinc-300 dark:text-[#1F1E35]" />
    </div>
  )
}

export default Public