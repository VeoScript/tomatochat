import React from 'react'
import Router from 'next/router'
import DialogBox from '../DialogBox'
import Spinner from '../../../utils/Spinner'
import CustomToaster from '../../CustomToaster'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useDeleteRoom } from '../../../lib/ReactQuery'
import { RiDeleteBin6Line } from 'react-icons/ri'

interface IProps {
  room: any
}

const DeleteRoom: React.FC<IProps> = ({ room }) => {

  const deleteRoom = useDeleteRoom()

  let [isOpen, setIsOpen] = React.useState(false)

  const { handleSubmit, formState: { isSubmitting } } = useForm()

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const onDeleteRoom = async () => {
    await deleteRoom.mutateAsync({
      roomId: String(room.id)
    }, 
    {
      onError() {
        toast.custom((trigger) => (
          <CustomToaster
            toast={toast}
            trigger={trigger}
            type={'Error'}
            message="There is an error while deleting this room. Check your internet"
          />
        ))
      },
      onSuccess() {
        toast.custom((trigger) => (
          <CustomToaster
            toast={toast}
            trigger={trigger}
            type={'Success'}
            message="Deleted Successfully."
          />
        ))
        Router.push('/')
      }
    })
  }

  return (
    <DialogBox 
      title="Delete Room"
      isOpen={isOpen} 
      openModal={openModal} 
      closeModal={closeModal} 
      className="outline-none flex w-full"
      maxWidth="max-w-md"
      button={
       <div className="inline-flex items-center w-full space-x-2 p-3 font-light text-xs text-left cursor-pointer text-black dark:text-white hover:bg-red-600 hover:text-tomato-light transition ease-in-out duration-200">
         <RiDeleteBin6Line className="w-5 h-5 text-zinc-400" />
          <span>Delete Room</span>
       </div>
      } 
    >
      <div className="flex flex-col items-center justify-center w-full space-y-5 text-sm">
        <p className="inline w-full">
          Are you sure you want to permanently delete { room.name }? This action cannot be undone.
        </p>
        <div className="inline-flex items-center w-full space-x-2">
          {!isSubmitting && (
            <React.Fragment>
              <button
                type="button"
                className="outline-none w-full p-2 rounded-md text-sm text-white bg-red-600 transition ease-in-out duration-200 hover:bg-opacity-80"
                onClick={handleSubmit(onDeleteRoom)}
              >
                Delete
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

export default DeleteRoom