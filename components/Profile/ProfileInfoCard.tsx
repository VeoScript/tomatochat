import React from 'react'
import Link from 'next/link'
import { RiLinkedinFill } from 'react-icons/ri'
import { Facebook, Instagram, Twitter, TikTok, Youtube } from '../../utils/SocialMediaIcons'

interface IProps {
  profile: any
}

const ProfileInfoCard: React.FC<IProps> = ({ profile }) => {
  return (
    <div className="sticky top-2 flex flex-col w-full max-w-xs p-5 space-y-3 rounded-md bg-white dark:bg-tomato-dark-slight">
      <div className="flex flex-col">
        <h2 className="font-bold text-lg text-zinc-700 dark:text-tomato-orange">Intro</h2>
        <h3 className="font-normal text-sm">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tenetur accusantium in aut sapiente? Perferendis dolorem laborum iste laudantium, delectus nemo autem nobis officiis eveniet quia in possimus, deleniti sequi minima?
        </h3>
      </div>
      <div className="flex flex-col">
        <h2 className="font-bold text-lg text-zinc-700 dark:text-tomato-orange">Hobbies</h2>
        <div className="flex space-x-1">
          <span className="px-2 py-1 rounded-full text-xs text-white cursor-default bg-tomato-orange">Pianist</span>
          <span className="px-2 py-1 rounded-full text-xs text-white cursor-default bg-tomato-orange">Coder</span>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <h2 className="font-bold text-lg text-zinc-700 dark:text-tomato-orange">Social Links</h2>
        <Link href={`https://www.facebook.com/${profile.facebook}`}>
          <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-tomato-orange" target="_blank">
            <Facebook className="w-4 h-4 fill-current text-zinc-500" />
            <span className="font-normal text-sm">
              @facebook
            </span>
          </a>
        </Link>
        <Link href={`https://www.facebook.com/${profile.instagram}`}>
          <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-tomato-orange" target="_blank">
            <Instagram className="w-4 h-4 fill-current text-zinc-500" />
            <span className="font-normal text-sm">
              @instagram
            </span>
          </a>
        </Link>
        <Link href={`https://www.facebook.com/${profile.linkedin}`}>
          <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-tomato-orange" target="_blank">
            <RiLinkedinFill className="w-4 h-4 fill-current text-zinc-500" />
            <span className="font-normal text-sm">
              @linkedin
            </span>
          </a>
        </Link>
        <Link href={`https://www.facebook.com/${profile.twitter}`}>
          <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-tomato-orange" target="_blank">
            <Twitter className="w-4 h-4 fill-current text-zinc-500" />
            <span className="font-normal text-sm">
              @twitter
            </span>
          </a>
        </Link>
        <Link href={`https://www.facebook.com/${profile.tiktok}`}>
          <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-tomato-orange" target="_blank">
            <TikTok className="w-4 h-4 fill-current text-zinc-500" />
            <span className="font-normal text-sm">
              @tiktok
            </span>
          </a>
        </Link>
        <Link href={`https://www.facebook.com/${profile.youtube}`}>
          <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-tomato-orange" target="_blank">
            <Youtube className="w-4 h-4 fill-current text-zinc-500" />
            <span className="font-normal text-sm">
              @youtube
            </span>
          </a>
        </Link>
      </div>
    </div>
  )
}

export default ProfileInfoCard