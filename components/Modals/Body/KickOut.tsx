import React from 'react'
import DialogBox from '../DialogBox'
import Spinner from '../../../utils/Spinner'
import CustomToaster from '../../CustomToaster'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useKickOutUser, useSendChatJoinMutation, useLastChatMutation } from '../../../lib/ReactQuery'
import { RiLogoutBoxLine } from 'react-icons/ri'

interface IProps {
  room: any
  memberUserId: string
  loggedInUserId: string
}

const KickOut: React.FC<IProps> = ({ room, memberUserId, loggedInUserId }) => {

  const kickOutUser = useKickOutUser()
  const sendChatJoinMutation = useSendChatJoinMutation()
  const lastChat = useLastChatMutation()

  let [isOpen, setIsOpen] = React.useState(false)

  const { handleSubmit, formState: { isSubmitting } } = useForm()

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const getJoinedRoom = room.find((room: any) => room.user.id === memberUserId)

  const onKickOut = async () => {
    const chatbox = `${getJoinedRoom.user.name} was kicked out by the admin.`

    await kickOutUser.mutateAsync({
      joinedRoomId: String(getJoinedRoom.id),
      userId: String(memberUserId)
    }, 
    {
      onError: async () => {
        toast.custom((trigger) => (
          <CustomToaster
            toast={toast}
            trigger={trigger}
            type={'Error'}
            message={`There is an error while kicking out ${getJoinedRoom.user.name}. Check your internet`}
          />
        ))
      },
      onSuccess: async () => {
        // send chat when the admin kicked-out the selected member
        await sendChatJoinMutation.mutateAsync({
          chatbox: String(chatbox),
          userId: String(loggedInUserId),
          roomSlug: String(getJoinedRoom.roomSlug)
        })
        // send last chat after user leave the room
        await lastChat.mutateAsync({
          roomSlug: String(getJoinedRoom.roomSlug),
          lastChat: String(chatbox),
          lastChatType: 'JOIN',
          lastSentUserId: String(getJoinedRoom.id),
          lastSentUserImage: String(getJoinedRoom.image),
          lastSentUserName: String(getJoinedRoom.name)
        })
      }
    })
    
    closeModal()
  }

  return (
    <DialogBox 
      title="Kick Out"
      isOpen={isOpen} 
      openModal={openModal} 
      closeModal={closeModal} 
      className="outline-none flex w-full"
      maxWidth="max-w-md"
      button={
       <div className="inline-flex items-center w-full space-x-2 p-3 font-light text-xs text-left cursor-pointer text-black dark:text-white hover:bg-red-600 hover:text-tomato-light transition ease-in-out duration-200">
         <RiLogoutBoxLine className="w-5 h-5 text-zinc-400" />
          <span>Kick out</span>
       </div>
      } 
    >
      <div className="flex flex-col items-center justify-center w-full space-y-5 text-sm">
        <p className="inline w-full">
          Are you sure you want to kick out { getJoinedRoom.user.name }?
        </p>
        <div className="inline-flex items-center w-full space-x-2">
          {!isSubmitting && (
            <React.Fragment>
              <button
                type="button"
                className="outline-none w-full p-2 rounded-md text-sm text-white bg-red-600 transition ease-in-out duration-200 hover:bg-opacity-80"
                onClick={handleSubmit(onKickOut)}
              >
                Confirm
              </button>
              <button
                type="button"
                className="outline-none w-full p-2 rounded-md text-sm text-white bg-tomato-dark-secondary transition ease-in-out duration-200 hover:bg-opacity-80"
                onClick={closeModal}
              >
                Cancel
              </button>
            </React.Fragment>
          )}
          {isSubmitting && (
            <div className="inline-flex items-center justify-center w-full space-x-2 p-2 cursor-wait rounded-md text-sm text-white bg-red-600 bg-opacity-80">
              <Spinner
                width={20}
                height={20}
                color={'#FFFFFF'}
              />
              <span className="font-light">Loading...</span>
            </div>
          )}
        </div>
      </div>
    </DialogBox>
  )
}

export default KickOut