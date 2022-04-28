import React from 'react'
import DialogBox from '../DialogBox'
import Spinner from '../../../utils/Spinner'
import CustomToaster from '../../CustomToaster'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useDeleteChat } from '../../../lib/ReactQuery'
import { RiCloseCircleLine } from 'react-icons/ri'

interface IProps {
  chatId: string
}

const DeleteChat: React.FC<IProps> = ({ chatId }) => {

  const deleteChat = useDeleteChat()

  let [isOpen, setIsOpen] = React.useState(false)

  const { handleSubmit, formState: { isSubmitting } } = useForm()

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const onDeleteChat = async () => {
    deleteChat.mutate({
      chatId: String(chatId)
    },
    {
      onError(err) {
        toast.custom((trigger) => (
          <CustomToaster
            toast={toast}
            trigger={trigger}
            type={'Error'}
            message={`${err}`}
          />
        ))
      }
    })
    closeModal()
  }

  return (
    <DialogBox 
      title="Delete Chat"
      isOpen={isOpen} 
      openModal={openModal} 
      closeModal={closeModal} 
      className="outline-none flex w-full"
      maxWidth="max-w-md"
      button={
        <RiCloseCircleLine className="w-3 h-3 text-pink-400" />
      } 
    >
      <div className="flex flex-col items-center justify-center w-full space-y-5 text-sm">
      <p className="inline w-full">
          Delete permanently this chat?
        </p>
        <div className="inline-flex items-center w-full space-x-2">
          {!isSubmitting && (
            <React.Fragment>
              <button
                type="button"
                className="outline-none w-full p-2 rounded-md text-sm bg-red-600 transition ease-in-out duration-200 hover:bg-opacity-80"
                onClick={handleSubmit(onDeleteChat)}
              >
                Delete
              </button>
              <button
                type="button"
                className="outline-none w-full p-2 rounded-md text-sm bg-purple-800 transition ease-in-out duration-200 hover:bg-opacity-80"
                onClick={closeModal}
              >
                Cancel
              </button>
            </React.Fragment>
          )}
          {isSubmitting && (
            <div className="inline-flex items-center justify-center w-full space-x-2 p-2 cursor-wait rounded-md text-sm bg-red-600 bg-opacity-80">
              <Spinner
                width={20}
                height={20}
                color={'#FFFFFF'}
              />
              <span className="font-light">Deleting...</span>
            </div>
          )}
        </div>
      </div>
    </DialogBox>
  )
}

export default DeleteChat