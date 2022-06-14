import React from 'react'
import DialogBox from '../DialogBox'
import Spinner from '../../../utils/Spinner'
import CustomToaster from '../../CustomToaster'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useDeleteCommentPost } from '../../../lib/ReactQuery'
import { RiDeleteBin6Line } from 'react-icons/ri'

interface IProps {
  user: any
  commentId: string
}

const DeleteComment: React.FC<IProps> = ({ user, commentId }) => {

  const deleteComment = useDeleteCommentPost()

  let [isOpen, setIsOpen] = React.useState(false)

  const { handleSubmit, formState: { isSubmitting } } = useForm()

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const onDeleteChat = async () => {
    const chatbox = `${user.name} removed one of its chat.`

    deleteComment.mutateAsync({
      commentId: String(commentId)
    },
    {
      onError: async (err) => {
        toast.custom((trigger) => (
          <CustomToaster
            toast={toast}
            trigger={trigger}
            type={'Error'}
            message={`${err}`}
          />
        ))
      },
      onSuccess: async () => {
        toast.custom((trigger) => (
          <CustomToaster
            toast={toast}
            trigger={trigger}
            type={'Success'}
            message="Comment deleted successfully."
          />
        ))
      }
    })
    closeModal()
  }

  return (
    <DialogBox 
      title="Delete Comment"
      isOpen={isOpen} 
      openModal={openModal} 
      closeModal={closeModal} 
      className="outline-none"
      maxWidth="max-w-md"
      button={
        <RiDeleteBin6Line className="w-3 h-3 text-zinc-400" />
      } 
    >
      <div className="flex flex-col items-center justify-center w-full space-y-5 text-sm">
      <p className="inline w-full">
          Delete permanently this comment?
        </p>
        <div className="inline-flex items-center w-full space-x-2">
          {!isSubmitting && (
            <React.Fragment>
              <button
                type="button"
                className="outline-none w-full p-2 rounded-md text-sm text-white bg-red-600 transition ease-in-out duration-200 hover:bg-opacity-80"
                onClick={handleSubmit(onDeleteChat)}
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
              <span className="font-light">Deleting...</span>
            </div>
          )}
        </div>
      </div>
    </DialogBox>
  )
}

export default DeleteComment