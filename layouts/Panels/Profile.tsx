import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import Image from 'next/image'
import { RiCameraFill } from 'react-icons/ri'

interface IProps {
  profile: any
}

const Profile: React.FC<IProps> = ({ profile }) => {

  console.log(profile)

  return (
    <div className="flex flex-col items-center w-full max-w-full h-full border-x border-zinc-300 dark:border-[#1F1836] overflow-x-hidden overflow-y-scroll">
      <div className="relative flex flex-col w-full max-w-4xl">
        <div
          className="relative flex w-full h-[18rem] rounded-b-xl bg-zinc-100 bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url('https://i.ibb.co/KjBTtGs/image-4728e-TRAPPIST-1.jpg')` }}
        >
          <button
            type="button"
            className="absolute right-3 bottom-3 inline-flex items-center space-x-1 p-2 z-10 rounded-md text-black text-xs bg-white bg-opacity-80 transition ease-in-out duration-200 hover:bg-opacity-50"
          >
            <RiCameraFill className="w-4 h-4" />
            <span>Change Cover Photo</span>
          </button>
        </div>
        <div className="absolute left-10 -bottom-24 flex w-full">
          <div className="relative flex w-full max-w-[10rem]">
            <Image
              src={profile.image}
              blurDataURL={profile.image}
              width={150}
              height={150}
              className="flex w-full max-w-[2.5rem] h-full max-h-[3rem] rounded-full object-cover bg-[#201A2C]"
              layout="intrinsic"
              quality={100}
              alt="Profile"
            />
            <button
              type="button"
              className="absolute right-3 bottom-3 inline-flex items-center space-x-1 p-2 z-10 rounded-full text-white dark:text-black text-xs bg-black dark:bg-white bg-opacity-60 dark:bg-opacity-80 transition ease-in-out duration-200 hover:bg-opacity-50 dark:hover:bg-opacity-50"
            >
              <RiCameraFill className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-row items-start justify-between w-full mr-5 mt-[4.5rem]">
            <div className="flex flex-col ml-3">
              <h3 className="font-bold text-2xl tracking-tight">{profile.name}</h3>
              <h3 className="font-normal text-base tracking-tight text-zinc-500 dark:text-zinc-400">250 followers</h3>
            </div>
            <div className="flex flex-col mr-10">
              <button
                title="Follow"
                type="button"
                className="outline-none px-3 py-2 rounded-md text-sm text-white bg-purple-800 transition ease-in-out duration-200 hover:bg-opacity-80"
                onClick={() => {
                  Router.push('/')
                }}
              >
                Follow
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile