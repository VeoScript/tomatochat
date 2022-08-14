import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import Image from 'next/image'
import ProfileUpload from '../Uploads/ProfileUpload'
import CoverUpload from '../Uploads/CoverUpload'
import FollowButton from '../Interactions/Follows/FollowButton'
import UnfollowButton from '../Interactions/Follows/UnfollowButton'
import { RiMapPin2Line, RiUserHeartLine } from 'react-icons/ri'

interface IProps {
  user: any
  profile: any
}

const ProfileHeader: React.FC<IProps> = ({ user, profile }) => {

  const [isFollow, setIsFollow] = React.useState(false)

  // check if the logged in user is already following to the user in profile page
  React.useEffect(() => {
    setIsFollow(profile.followers.some((followUser: { followingId: string }) => followUser.followingId === user.id))
  }, [user, profile])

  return (
    <div className="relative flex flex-col w-full max-w-full">
      <div
        className="relative flex w-full h-[18rem] rounded-b-xl bg-white dark:bg-tomato-dark-secondary bg-center bg-cover bg-no-repeat"
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
            className="flex w-full max-w-[2.5rem] rounded-full object-cover bg-tomato-light dark:bg-tomato-dark-slight"
            layout="intrinsic"
            quality={100}
            alt="Profile"
          />
          {user.id === profile.id && (
            <ProfileUpload profile={profile} />
          )}
        </div>
        <div className="flex flex-row items-start justify-between w-full mr-10 mt-[4rem]">
          <div className="flex flex-col ml-3 space-y-2">
            <Link href={`/profile/${profile.id}`}>
              <a className="font-bold text-2xl tracking-tight">{profile.name}</a>
            </Link>
            <div className="flex flex-col">
              <h3 className="inline-flex items-center space-x-1 font-normal text-sm tracking-tight text-zinc-500 dark:text-zinc-400">
                <RiUserHeartLine />
                <Link href={`/profile/${profile.id}/followers`}>
                  <a className="hover:underline">
                    <span className="font-bold">{profile.followers.length}</span> followers
                  </a>
                </Link>
                <span>&bull;</span>
                <Link href={`/profile/${profile.id}/following`}>
                  <a className="hover:underline">
                    <span className="font-bold">{profile.following.length}</span> following
                  </a>
                </Link>
              </h3>
              {profile.location && (
                <h3 className="inline-flex items-center space-x-1 font-normal text-sm tracking-tight text-zinc-500 dark:text-zinc-400">
                  <RiMapPin2Line />
                  <span>{profile.location}</span>
                </h3>
              )}
            </div>
          </div>
          <div className="flex flex-col mt-5 mr-10">
            {user.id === profile.id
              ? <button
                  title="Edit Profile"
                  type="button"
                  className="w-[10rem] outline-none px-3 py-2 rounded-md text-sm text-white bg-tomato-orange transition ease-in-out duration-200 hover:bg-opacity-80"
                  onClick={() => {
                    Router.push(`/profile/${user.id}/settings`)
                  }}
                >
                  Edit Profile
                </button>
              : <div className="flex flex-row items-center w-full space-x-1">
                  {!isFollow
                    ? <FollowButton
                        user={user}
                        profile={profile}
                        size="w-[10rem]"
                      />
                    : <UnfollowButton
                        user={user}
                        profile={profile}
                        size="w-[10rem]"
                      />
                  }
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader