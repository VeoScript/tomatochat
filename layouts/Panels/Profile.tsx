import React from 'react'
import { useRouter } from 'next/router'
import ProfileHeader from '../../components/Profile/ProfileHeader'
import ProfileTimeline from '../../components/Profile/ProfileTimeline'
import ProfileFollowers from '../../components/Profile/ProfileFollowers'
import ProfileFollowing from '../../components/Profile/ProfileFollowing'
import ProfileSettings from '../../components/Profile/ProfileSettings'

interface IProps {
  user: any
  profile: any
}

const Profile: React.FC<IProps> = ({ user, profile }) => {

  const { pathname } = useRouter()
  
  return (
    <div className="flex flex-col items-center w-full max-w-full h-full px-5 overflow-x-hidden overflow-y-scroll scroll-smooth scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
      <ProfileHeader
        user={user}
        profile={profile}
      />
      {pathname === '/profile/[id]' && (
        <ProfileTimeline
          user={user}
          profile={profile}
        />
      )}
      {pathname === '/profile/[id]/followers' && (
        <ProfileFollowers
          user={user}
          profile={profile}
        />
      )}
      {pathname === '/profile/[id]/following' && (
        <ProfileFollowing
          user={user}
          profile={profile}
        />
      )}
      {pathname === '/profile/[id]/settings' && (
        <ProfileSettings
          user={user}
          profile={profile}
        />
      )}
    </div>
  )
}

export default Profile