import React from 'react'
import Image from 'next/image'
import DialogBoxLarge from '../DialogBoxLarge'
import { RiAddLine } from 'react-icons/ri'

const CreatePostModal = () => {

  let [createPostIsOpen, setCreatePostIsOpen] = React.useState(false)

  const openModal = () => {
    setCreatePostIsOpen(true)
  }

  const closeModal = () => {
    setCreatePostIsOpen(false)
  }

  return (
    <DialogBoxLarge
      className="outline-none"
      isOpen={createPostIsOpen}
      openModal={openModal}
      closeModal={closeModal}
      button={
        <RiAddLine className="w-6 h-6 text-zinc-500 transition ease-in-out duration-200 transform hover:scale-90" />
      }
    >
      
    </DialogBoxLarge>
  )
}

export default CreatePostModal