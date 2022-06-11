import React from 'react'
import Link from 'next/link'
import { Dialog } from '@headlessui/react'
import { RiCloseLine } from 'react-icons/ri'

interface IProps {
  children: any
  isOpen: any
  openModal: any
  closeModal: any
  button: any
  className: string
}

const DialogBoxLarge: React.FC<IProps> = ({ children, button, className, isOpen, openModal, closeModal }) => {
  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={className}
      >
        {button}
      </button>

      <Dialog
        open={isOpen}
        onClose={closeModal}
        className="fixed z-30 inset-0 overflow-y-auto"
      >
        <div className="relative flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-zinc-100 dark:bg-gradient-to-br dark:from-[#1B1325] dark:via-[#12111B] dark:to-[#18132A]" />
          <button
            title="Close (Esc)"
            type="button"
            onClick={closeModal}
            className="absolute top-5 right-5 z-20 p-2 outline-none rounded-full bg-black dark:bg-white bg-opacity-50 dark:bg-opacity-30 transition ease-in-out duration-200 transform hover:scale-90"
          >
            <RiCloseLine className="w-5 h-5 text-white dark:text-white" />
          </button>
          <div className="flex">
            {children}
          </div>
        </div>
      </Dialog>
    </>
  ) 
}

export default DialogBoxLarge