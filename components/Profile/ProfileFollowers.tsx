import React from 'react'
import Link from 'next/link'
import PostProfile from '../../components/Images/PostProfile'
import ProfileInfoCard from './ProfileInfoCard'
import FollowButton from '../Interactions/Follows/FollowButton'
import UnfollowButton from '../Interactions/Follows/UnfollowButton'
import Spinner from '../../utils/Spinner'
import { useGetFollowers } from '../../lib/ReactQuery'
import { useInView } from 'react-intersection-observer'
import { RiEmotionSadLine, RiMapPin2Line, RiUserHeartLine } from 'react-icons/ri'

interface IProps {
  user: any
  profile: any
}

const ProfileFollowers: React.FC<IProps> = ({ user, profile }) => {

  const { ref, inView } = useInView()

  const { data: followers, isLoading: followersLoading, isError: followersError, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetFollowers(String(profile.id))

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, inView])

  return (
    <div className="relative flex flex-row items-start w-full max-w-full mt-[9rem] mb-[1rem] space-x-3">
      <ProfileInfoCard
        user={user}
        profile={profile}
      />
      <div className="inline-flex w-full max-w-full h-full overflow-hidden">
        <div className="flex flex-col items-center justify-start w-full max-w-full h-full space-y-2">
          {followers?.pages[0].followers.followers.length > 0 && (
            <div className="inline-flex items-center justify-between w-full mb-2 px-3 text-neutral-600 dark:text-neutral-300">
              <h3 className="font-black text-2xl">Followers</h3>
            </div>
          )}
          {followersLoading && (
            <div className="flex flex-row items-center justify-center w-full h-full py-5">
              <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
                <Spinner width={40} height={40} color={'#F16506'} />
                <h3 className="font-light text-sm">Loading...</h3>
              </div>
            </div>
          )}
          {followersError && (
            <div className="flex flex-col items-center justify-center w-full h-full space-y-2 text-zinc-400">
              <RiEmotionSadLine className="w-14 h-14 text-tomato-orange text-opacity-50" />
              <div className="inline-flex items-center justify-center w-full space-x-1 text-xs">
                <h3 className="font-light">Failed to load, try to</h3>
                <button
                  type="button"
                  className="outline-none font-bold text-tomato-orange hover:underline"
                  onClick={() => refetch()}
                >
                  Reload
                </button>
              </div>
            </div>
          )}
          {!(followersLoading && followersError) && (
            <React.Fragment>
              {followers && followers.pages[0].followers.followers.length === 0 && (
                <div className="inline-flex items-center justify-center w-full">
                  <div className="flex flex-col items-start w-full max-w-md space-y-3">
                    <h1 className="font-black text-4xl text-zinc-800 dark:text-zinc-100">
                      {profile.name} doesn&apos;t have any followers yet.
                    </h1>
                    <h3 className="text-lg text-zinc-500">When they do, their followers will show up here.</h3>
                    <Link href={`/profile/${profile.id}`}>
                      <a className="font-normal text-sm text-neutral-400 hover:underline">Back to Timeline</a>
                    </Link>
                  </div>
                </div>
              )}
              {followers && followers.pages.map((page: any, i: number) => (
                <React.Fragment key={i}>
                  {page.followers.followers.map((followerUser: any) => {
                    // check if the user in user followers list is already followed by the logged in user
                    const checkFollow = followerUser.following.followers.some((follow: { followingId: any }) => follow.followingId === user.id)
                    return (
                      <div
                        key={followerUser.following.id}
                        className="flex flex-row items-center justify-between w-full p-3 rounded-xl back-shadow bg-white dark:bg-tomato-dark-slight"
                      >
                        <div className="inline-flex items-start space-x-2">
                          <Link href={`/profile/${followerUser.following.id}`}>
                            <a><PostProfile src={followerUser.following.image} /></a>
                          </Link>
                          <div className="flex flex-col justify-center">
                            <Link href={`/profile/${followerUser.following.id}`}>
                              <a className="font-bold text-base">{followerUser.following.name}</a>
                            </Link>
                            <div className="inline-flex items-center space-x-2">
                              {followerUser.following.location && (
                                <div className="inline-flex items-center space-x-0.5 text-sm text-neutral-400">
                                  <RiMapPin2Line />
                                  <h4 className="font-light">{followerUser.following.location}</h4>
                                </div>
                              )}
                              <div className="inline-flex items-center space-x-0.5 text-sm text-neutral-400">
                                <RiUserHeartLine />
                                <h4 className="font-light">{followerUser.following.followers.length} Followers</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                        {checkFollow && (
                          <UnfollowButton
                            user={user}
                            profile={followerUser.following}
                            size="w-[7rem]"
                          />
                        )}
                        {!checkFollow && (
                          <>
                            {followerUser.following.id !== user.id && (
                              <FollowButton
                                user={user}
                                profile={followerUser.following}
                                size="w-[7rem]"
                              />
                            )}
                          </>
                        )}
                      </div>
                    )
                  })}
                </React.Fragment>
              ))}
              <button
                ref={ref}
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
              >
                {isFetchingNextPage
                  ? <Spinner width={40} height={40} color={'#F16506'} />
                  : hasNextPage
                  ? 'Load more followers...'
                  : ''}
              </button>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileFollowers