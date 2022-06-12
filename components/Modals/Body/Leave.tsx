import React from 'react'
import Router from 'next/router'
import DialogBox from '../DialogBox'
import Spinner from '../../../utils/Spinner'
import CustomToaster from '../../CustomToaster'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useLeaveUser, useSendChatJoinMutation, useLastChatMutation } from '../../../lib/ReactQuery'
import { RiLogoutBoxLine } from 'react-icons/ri'

interface IProps {
  room: any
  userId: string
}

const Leave: React.FC<IProps> = ({ room, userId }) => {

  const leaveUser = useLeaveUser()
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

  // get all joined-room id and userId
  const getAllJoinedRoomId = room.joinedroom.map((join: any) => {
    return {
      id: join.id,
      userName: join.user.name,
      userId: join.user.id
    }
  })

  // get specific joined-room id by userId
  const getJoinedRoom = getAllJoinedRoomId.find((joinUser: any) => joinUser.userId === userId)

  const onLeave = async () => {
    const chatbox = `${getJoinedRoom.userName} left the room.`

    await leaveUser.mutateAsync({
      joinedRoomId: String(getJoinedRoom.id)
    }, 
    {
      onError: async () => {
        toast.custom((trigger) => (
          <CustomToaster
            toast={toast}
            trigger={trigger}
            type={'Error'}
            message={'There is an error while leaving this room. Check your internet'}
          />
        ))
      },
      onSuccess: async () => {
        // send chat when the user is leave the room
        await sendChatJoinMutation.mutateAsync({
          chatbox: String(chatbox),
          userId: String(getJoinedRoom.userId),
          roomSlug: String(room.slug)
        })
        // send last chat after user leave the room
        await lastChat.mutateAsync({
          roomSlug: String(room.slug),
          lastChat: String(chatbox),
          lastChatType: 'JOIN',
          lastSentUserId: String(getJoinedRoom.id),
          lastSentUserImage: String(getJoinedRoom.image),
          lastSentUserName: String(getJoinedRoom.name)
        })
        toast.custom((trigger) => (
          <CustomToaster
            toast={toast}
            trigger={trigger}
            type={'Success'}
            message="You left the room successfully."
          />
        ))
        Router.push('/discover')
      }
    })
  }

  return (
    <DialogBox 
      title="Leave Room"
      isOpen={isOpen} 
      openModal={openModal} 
      closeModal={closeModal} 
      className="outline-none flex w-full"
      maxWidth="max-w-md"
      button={
       <div className="inline-flex items-center w-full space-x-2 p-3 font-light text-xs text-left cursor-pointer text-black dark:text-white hover:bg-red-600 hover:text-tomato-light transition ease-in-out duration-200">
         <RiLogoutBoxLine className="w-5 h-5 text-zinc-400" />
          <span>Leave Room</span>
       </div>
      } 
    >
      <div className="flex flex-col items-center justify-center w-full space-y-5 text-sm">
        <p className="inline w-full">
          Are you sure you want to leave { room.name }?
        </p>
        <div className="inline-flex items-center w-full space-x-2">
          {!isSubmitting && (
            <React.Fragment>
              <button
                type="button"
                className="outline-none w-full p-2 rounded-md text-sm text-white bg-red-600 transition ease-in-out duration-200 hover:bg-opacity-80"
                onClick={handleSubmit(onLeave)}
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

export default Leave