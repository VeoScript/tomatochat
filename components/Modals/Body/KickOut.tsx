import React from 'react'
import DialogBox from '../DialogBox'
import CustomToaster from '../../CustomToaster'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useKickOutUser, useSendChatJoinMutation } from '../../../lib/ReactQuery'
import { RiLogoutBoxLine } from 'react-icons/ri'

interface IProps {
  room: any
  memberUserId: string
  loggedInUserId: string
}

const KickOut: React.FC<IProps> = ({ room, memberUserId, loggedInUserId }) => {

  const kickOutUser = useKickOutUser()
  const sendChatJoinMutation = useSendChatJoinMutation()

  let [isOpen, setIsOpen] = React.useState(false)

  const { handleSubmit, formState: { isSubmitting } } = useForm()

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const getJoinedRoom = room.find((room: any) => room.user.id === memberUserId)

  const onLeave = async () => {
    const chatbox = `${getJoinedRoom.user.name} was kicked-out by the admin.`

    await kickOutUser.mutate({
      joinedRoomId: String(getJoinedRoom.id),
      userId: String(memberUserId)
    }, 
    {
      onError() {
        toast.custom((trigger) => (
          <CustomToaster
            toast={toast}
            trigger={trigger}
            type={'Error'}
            message={`There is an error while kicking out ${getJoinedRoom.user.name}. Check your internet`}
          />
        ))
      },
      onSuccess() {
        // send chat when the admin kicked-out the selected member
        sendChatJoinMutation.mutate({
          chatbox: String(chatbox),
          userId: String(loggedInUserId),
          roomSlug: String(getJoinedRoom.roomSlug)
        })
      }
    })
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
       <div className="inline-flex items-center w-full space-x-2 p-3 font-light text-xs text-left cursor-pointer hover:bg-red-700 text-purewhite transition ease-in-out duration-200">
         <RiLogoutBoxLine className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
          <span>Kick out</span>
       </div>
      } 
    >
      <div className="flex flex-col items-center justify-center w-full space-y-5 text-sm">
        <p className="inline w-full">
          Are you sure you want to kick out { getJoinedRoom.user.name }?
        </p>
        <div className="inline-flex items-center w-full space-x-2">
          <button
            type="button"
            className="outline-none w-full p-2 rounded-md text-sm bg-red-600 transition ease-in-out duration-200 hover:bg-opacity-80"
            onClick={handleSubmit(onLeave)}
          >
            Confirm
          </button>
          <button
            type="button"
            className="outline-none w-full p-2 rounded-md text-sm bg-purple-800 transition ease-in-out duration-200 hover:bg-opacity-80"
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </DialogBox>
  )
}

export default KickOut