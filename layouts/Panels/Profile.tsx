import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import Image from 'next/image'
import CoverUpload from '../../components/Uploads/CoverUpload'
import ProfileUpload from '../../components/Uploads/ProfileUpload'
import CreatePost from '../../components/CreatePost'
import CardPost from '../../components/Cards/CardPost'
import { RiMapPin2Line, RiUserHeartLine, RiLinkedinFill } from 'react-icons/ri'
import { Facebook, Instagram, Twitter, TikTok, Youtube } from '../../utils/SocialMediaIcons'

import { posts } from '../../mock/posts'

interface IProps {
  user: any
  profile: any
}

const Profile: React.FC<IProps> = ({ user, profile }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-full h-full border-x border-zinc-300 dark:border-[#1F1836] overflow-x-hidden overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-500 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
      <div className="relative flex flex-col w-full max-w-4xl">
        <div
          className="relative flex w-full h-[18rem] rounded-b-xl bg-white dark:bg-[#1F1E35] bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${profile.coverImage ? profile.coverImage : null})` }}
        >
          {user.id === profile.id && (
            <CoverUpload profile={profile} />
          )}
        </div>
        <div className="absolute left-10 -bottom-28 flex w-full">
          <div className="relative flex w-full max-w-[10rem] overflow-auto">
            <Image
              src={profile.image}
              blurDataURL={profile.image}
              width={150}
              height={150}
              className="flex w-full max-w-[2.5rem] rounded-full object-cover bg-white dark:bg-[#201A2C]"
              layout="intrinsic"
              quality={100}
              alt="Profile"
            />
            {user.id === profile.id && (
              <ProfileUpload profile={profile} />
            )}
          </div>
          <div className="flex flex-row items-start justify-between w-full mr-10 mt-[4rem]">
            <div className="flex flex-col ml-3">
              <h3 className="font-bold text-2xl tracking-tight">{profile.name}</h3>
              <h3 className="inline-flex items-center space-x-1 font-normal text-sm tracking-tight text-zinc-500 dark:text-zinc-400">
                <RiUserHeartLine />
                <Link href="/">
                  <a className="hover:underline"><span className="font-bold">250</span> followers</a>
                </Link>
                <span>&bull;</span>
                <Link href="/">
                  <a className="hover:underline"><span className="font-bold">89</span> following</a>
                </Link>
              </h3>
              <h3 className="inline-flex items-center space-x-1 font-normal text-sm tracking-tight text-zinc-500 dark:text-zinc-400">
                <RiMapPin2Line />
                <span>Philippines</span>
              </h3>
            </div>
            <div className="flex flex-col mt-5 mr-10">
              <button
                title="Follow"
                type="button"
                className="w-[10rem] outline-none px-3 py-2 rounded-md text-sm text-white bg-purple-800 transition ease-in-out duration-200 hover:bg-opacity-80"
                onClick={() => {
                  Router.push('/')
                }}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex flex-row items-start w-full max-w-4xl mt-[9rem] mb-[2rem] space-x-3">
        <div className="sticky top-2 flex flex-col w-full max-w-xs p-3 space-y-3 rounded-md bg-white dark:bg-[#1F1E35]">
          <div className="flex flex-col">
            <h2 className="font-bold text-lg text-zinc-700 dark:text-purple-400">Intro</h2>
            <h3 className="font-normal text-sm">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tenetur accusantium in aut sapiente? Perferendis dolorem laborum iste laudantium, delectus nemo autem nobis officiis eveniet quia in possimus, deleniti sequi minima?
            </h3>
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold text-lg text-zinc-700 dark:text-purple-400">Hobbies</h2>
            <div className="flex space-x-1">
              <span className="px-2 py-1 rounded-full text-xs text-white cursor-default bg-purple-400">Shabu</span>
              <span className="px-2 py-1 rounded-full text-xs text-white cursor-default bg-purple-400">Marijuana</span>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <h2 className="font-bold text-lg text-zinc-700 dark:text-purple-400">Social Links</h2>
            <Link href={`https://www.facebook.com/${profile.facebook}`}>
              <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-purple-300" target="_blank">
                <Facebook className="w-4 h-4 fill-current text-zinc-500" />
                <span className="font-normal text-sm">
                  @facebook
                </span>
              </a>
            </Link>
            <Link href={`https://www.facebook.com/${profile.instagram}`}>
              <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-purple-300" target="_blank">
                <Instagram className="w-4 h-4 fill-current text-zinc-500" />
                <span className="font-normal text-sm">
                  @instagram
                </span>
              </a>
            </Link>
            <Link href={`https://www.facebook.com/${profile.linkedin}`}>
              <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-purple-300" target="_blank">
                <RiLinkedinFill className="w-4 h-4 fill-current text-zinc-500" />
                <span className="font-normal text-sm">
                  @linkedin
                </span>
              </a>
            </Link>
            <Link href={`https://www.facebook.com/${profile.twitter}`}>
              <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-purple-300" target="_blank">
                <Twitter className="w-4 h-4 fill-current text-zinc-500" />
                <span className="font-normal text-sm">
                  @twitter
                </span>
              </a>
            </Link>
            <Link href={`https://www.facebook.com/${profile.tiktok}`}>
              <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-purple-300" target="_blank">
                <TikTok className="w-4 h-4 fill-current text-zinc-500" />
                <span className="font-normal text-sm">
                  @tiktok
                </span>
              </a>
            </Link>
            <Link href={`https://www.facebook.com/${profile.youtube}`}>
              <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-purple-300" target="_blank">
                <Youtube className="w-4 h-4 fill-current text-zinc-500" />
                <span className="font-normal text-sm">
                  @youtube
                </span>
              </a>
            </Link>
          </div>
        </div>
        <div className="flex flex-col w-full max-w-xl space-y-3">
          <CreatePost
            user={user}
            profile={profile}
          />
          {posts.map((post: any, i: number) => (
            <CardPost
              key={i}
              profile={profile}
              post={post}          
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile