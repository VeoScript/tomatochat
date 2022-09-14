import React from 'react'
import Link from 'next/link'
import PostProfile from '../Images/PostProfile'
import moment from 'moment'
import { Dialog } from '@headlessui/react'
import { RiCloseLine } from 'react-icons/ri'

interface IProps {
  children: any
  isOpen: any
  openModal: any
  closeModal: any
  button: any
  title: string
  subtitle?: string
  postDate?: Date
  profile?: any
  isLink?: boolean
  linkValue?: string
  className: string
  maxWidth: string
}

const DialogBox: React.FC<IProps> = ({
    children,
    button,
    title,
    subtitle,
    postDate,
    profile,
    isLink,
    linkValue,
    className,
    maxWidth,
    isOpen,
    openModal,
    closeModal
  }) => {

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
          <Dialog.Overlay className="fixed inset-0 bg-[#333] dark:bg-white opacity-20" />
          <div className={`relative flex flex-col w-full ${ maxWidth } mx-auto p-5 space-y-3 rounded-xl text-[#333] dark:text-white bg-tomato-light-secondary dark:bg-tomato-dark`}>
            <div className="inline-flex w-full">
              {isLink
                ? <Link href={`/profile/${linkValue}`}>
                    <a className="inline-flex items-center space-x-2 outline-none">
                      <PostProfile src={profile} />
                      <div className="flex flex-col">
                        <span className="font-semibold text-xl outline-none">{ title }</span>
                        <span className="font-light text-xs text-zinc-400">
                          {moment(postDate).fromNow()}
                        </span>
                      </div>
                    </a>
                  </Link>
                : <h2 className="font-semibold">{ title }</h2>
              }
              <button
                title="Close"
                type="button"
                onClick={closeModal}
                className="absolute top-5 right-5 outline-none"
              >
                <RiCloseLine className="w-5 h-5 text-zinc-500 transition ease-in-out duration-200 transform hover:scale-90" />
              </button>
            </div>
            {subtitle && (
              <div className="flex w-full">
                <p className="font-normal text-sm whitespace-pre-wrap">{ subtitle }</p>
              </div>
            )}
            {children}
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default DialogBox