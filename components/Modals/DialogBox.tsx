import React from 'react'
import { Dialog } from '@headlessui/react'
import { RiCloseLine } from 'react-icons/ri'

interface IProps {
  children: any
  isOpen: any
  openModal: any
  closeModal: any
  button: any
  title: string
  className: string
  maxWidth: string
}

const DialogBox: React.FC<IProps> = ({ children, button, title, className, maxWidth, isOpen, openModal, closeModal }) => {
  return (
    <>
      <button
        type="button"
        title={title}
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
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-white opacity-20" />
          <div className={`relative flex flex-col w-full ${ maxWidth } mx-auto p-5 space-y-3 rounded-md text-white bg-gradient-to-br from-[#1B1325] via-[#12111B] to-[#18132A]`}>
            <div className="inline-flex w-full">
              <h2 className="font-semibold">{ title }</h2>
              <button
                title="Close"
                type="button"
                onClick={closeModal}
                className="absolute top-5 right-5 outline-none"
              >
                <RiCloseLine className="w-5 h-5 text-zinc-500 transition ease-in-out duration-200 transform hover:scale-90" />
              </button>
            </div>
            {children}
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default DialogBox