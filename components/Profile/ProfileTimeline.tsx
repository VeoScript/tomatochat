import React from 'react'
import CreatePost from '../CreatePost'
import CardPost from '../Cards/CardPost'
import PostCardSkeleton from '../SkeletonLoader/PostCardSkeleton'
import ProfileInfoCard from './ProfileInfoCard'
import { useGetUserPosts } from '../../lib/ReactQuery'
import { useInView } from 'react-intersection-observer'
import { RiEmotionSadLine } from 'react-icons/ri'

interface IProps {
  user: any
  profile: any
}

const ProfileTimeline: React.FC<IProps> = ({ user, profile }) => {

  const { ref, inView } = useInView()

  const { data: userPosts, isLoading: postLoading, isError: postError, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetUserPosts(profile.id)

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
      <div className="flex flex-col w-full max-w-full overflow-hidden space-y-3">
        {user.id === profile.id && (
          <CreatePost
            user={user}
            profile={profile}
          />
        )}
        {postLoading && (
          <PostCardSkeleton />
        )}
        {postError && (
          <div className="flex flex-col items-center justify-center w-full py-5 space-y-2">
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
        {!(postLoading && postError) && (
          <React.Fragment>
            {userPosts && userPosts.pages[0].posts.length === 0 && (
              <div className="inline-flex items-center justify-center w-full py-5">
                <div className="flex flex-col items-start w-full max-w-md space-y-3">
                  <h1 className="font-black text-4xl text-zinc-800 dark:text-zinc-100">
                    {profile.name} has no posts yet.
                  </h1>
                  <h3 className="text-lg text-zinc-500">When they do, their posts will show up here.</h3>
                </div>
              </div>
            )}
            {userPosts && userPosts.pages.map((page: any, i: number) => (
              <React.Fragment key={i}>
                {page.posts.map((post: any, i: number) => (
                  <CardPost
                    key={i}
                    profile={profile}
                    user={user}
                    post={post}                      
                  />
                ))}
              </React.Fragment>
            ))}
            <button
              ref={ref}
              onClick={() => fetchNextPage()}
              className="flex flex-col items-center justify-center w-full space-y-2"
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? <PostCardSkeleton />
                : hasNextPage
                ? ''
                : ''}
            </button>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

export default ProfileTimeline