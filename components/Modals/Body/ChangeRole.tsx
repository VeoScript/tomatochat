import React from 'react'
import DialogBox from '../DialogBox'
import CustomToaster from '../../CustomToaster'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useChangeRole, useSendChatJoinMutation } from '../../../lib/ReactQuery'
import { RiShieldLine } from 'react-icons/ri'
import Spinner from '../../../utils/Spinner'

interface IProps {
  room: any
  role: string
  memberUserId: string
  loggedInUserId: string
}

interface FormData {
  role: string
}

const ChangeRole: React.FC<IProps> = ({ room, role, memberUserId, loggedInUserId }) => {

  const changeRole = useChangeRole()
  const sendChatJoinMutation = useSendChatJoinMutation()

  const getAdmins = room.filter((admin: any) => admin.role === 'ADMIN')

  const getJoinedRoom = room.find((room: any) => room.user.id === memberUserId)

  const defaultValues = {
    role: getJoinedRoom.role
  }

  const { handleSubmit, register, reset, formState: { isSubmitting } } = useForm<FormData>({ defaultValues })

  let [isOpen, setIsOpen] = React.useState(false)

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    reset()
  }

  const onChangeRole = async (formData: FormData) => {
    const role = formData.role
    const chatbox = `Admin change the role of ${getJoinedRoom.user.name} to ${role}.`

    await changeRole.mutateAsync({
      joinedRoomId: String(getJoinedRoom.id),
      role: String(role)
    }, 
    {
      onError: async () => {
        toast.custom((trigger) => (
          <CustomToaster
            toast={toast}
            trigger={trigger}
            type={'Error'}
            message={`There is an error while changing the role of ${getJoinedRoom.user.name}. Check your internet`}
          />
        ))
      },
      onSuccess: async () => {
        // send chat when the admin change the role of selected member
        await sendChatJoinMutation.mutateAsync({
          chatbox: String(chatbox),
          userId: String(loggedInUserId),
          roomSlug: String(getJoinedRoom.roomSlug)
        })
      }
    })
  }

  return (
    <DialogBox 
      title="Change Role"
      isOpen={isOpen} 
      openModal={openModal} 
      closeModal={closeModal} 
      className="outline-none flex w-full"
      maxWidth="max-w-md"
      button={
       <div className="inline-flex items-center w-full space-x-2 p-3 font-light text-xs text-left cursor-pointer transition ease-in-out duration-200 hover:bg-zinc-100 dark:hover:bg-[#464A4D]">
         <RiShieldLine className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
         <span>Change Role</span>
       </div>
      } 
    >
      {/* the logic here is if the admin is only one in the room, they cannot change the member roles unless it's more than 1 admins */}
      {(getJoinedRoom.role === 'ADMIN' && getAdmins.length === 1) && (
        <div className="inline-flex items-center justify-center w-full space-y-2 text-sm">
          It is not possible to change roles when there is only one room Administrator.
        </div>
      )}
      {(getJoinedRoom.role === 'ADMIN' && getAdmins.length > 1) && (
        <form onSubmit={handleSubmit(onChangeRole)} className="flex flex-col items-center justify-center w-full space-y-2 text-sm">
          <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-800 dark:text-tomato-light bg-white dark:bg-tomato-dark-secondary border border-zinc-300 dark:border-transparent focus-within:border-tomato-orange dark:focus-within:border-tomato-orange">
            <select
              className="w-full outline-none bg-white dark:bg-tomato-dark-secondary text-sm cursor-pointer"
              {...register('role', { required: true })}
            >
              <option value="" className="hidden">Select Role</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <RiShieldLine className="w-4 h-4" />
          </span>
          <div className="inline-flex items-center w-full space-x-2">
            {!isSubmitting && (
              <button
                type="submit"
                className="outline-none w-full p-2 rounded-md text-sm text-white bg-tomato-orange transition ease-in-out duration-200 hover:bg-opacity-80"
              >
                Save
              </button>
            )}
            {isSubmitting && (
              <div className="inline-flex items-center justify-center w-full space-x-2 p-2 cursor-wait rounded-md text-sm text-white bg-tomato-orange bg-opacity-80">
                <Spinner
                  width={20}
                  height={20}
                  color={'#FFFFFF'}
                />
                <span className="font-light">Saving...</span>
              </div>
            )}
          </div>
        </form>
      )}
      {getJoinedRoom.role === 'USER' && (
        <form onSubmit={handleSubmit(onChangeRole)} className="flex flex-col items-center justify-center w-full space-y-2 text-sm">
          <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-800 dark:text-tomato-light bg-white dark:bg-tomato-dark-secondary border border-zinc-300 dark:border-transparent focus-within:border-tomato-orange dark:focus-within:border-tomato-orange">
            <select
              className="w-full outline-none bg-white dark:bg-tomato-dark-secondary text-sm cursor-pointer"
              {...register('role', { required: true })}
            >
              <option value="" className="hidden">Select Role</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <RiShieldLine className="w-4 h-4" />
          </span>
          <div className="inline-flex items-center w-full space-x-2">
            {!isSubmitting && (
              <button
                type="submit"
                className="outline-none w-full p-2 rounded-md text-sm text-white bg-tomato-orange transition ease-in-out duration-200 hover:bg-opacity-80"
              >
                Save
              </button>
            )}
            {isSubmitting && (
              <div className="inline-flex items-center justify-center w-full space-x-2 p-2 cursor-wait rounded-md text-sm text-white bg-tomato-orange bg-opacity-80">
                <Spinner
                  width={20}
                  height={20}
                  color={'#FFFFFF'}
                />
                <span className="font-light">Saving...</span>
              </div>
            )}
          </div>
        </form>
      )}
    </DialogBox>
  )
}

export default ChangeRole