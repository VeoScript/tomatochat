import React from 'react'
import AdsSuggestions from './AdsSuggestions'
import CardPost from '../../components/Cards/CardPost'
import CreatePost from '../../components/CreatePost'
import PostCardSkeleton from '../../components/SkeletonLoader/PostCardSkeleton'
import NavBarSearch from '../../components/NavBar/NavBarSearch'
import { useGetNewsFeedPosts } from '../../lib/ReactQuery'
import { useInView } from 'react-intersection-observer'
import {RiEmotionSadLine, RiFilter2Fill } from 'react-icons/ri'

interface IProps {
  user: any
  profile: any
}

const NewsFeed: React.FC<IProps> = ({ user, profile }) => {

  const { ref, inView } = useInView()

  const { data: newsfeedPosts, isLoading: newsfeedLoading, isError: newsfeedError, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetNewsFeedPosts()

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, inView])

  return (
    <div className="inline-flex w-full max-w-full h-full overflow-hidden">
      <div className="flex flex-col items-center justify-start w-full max-w-full h-full px-0 md:px-4 space-y-2 overflow-y-scroll scroll-smooth scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
        <NavBarSearch />
        <CreatePost
          user={user}
          profile={profile}
        />
        {newsfeedLoading && (
          <PostCardSkeleton />
        )}
        {newsfeedError && (
          <div className="flex flex-col items-center justify-center w-full h-screen space-y-2 text-zinc-400">
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
        {!(newsfeedLoading && newsfeedError) && (
          <React.Fragment>
            {newsfeedPosts && newsfeedPosts.pages[0].newsfeed.length == 0 && (
              <div className="inline-flex items-center justify-center w-full h-full py-10">
                <div className="flex flex-col items-start w-full max-w-md space-y-3">
                  <h1 className="font-black text-4xl text-zinc-800 dark:text-zinc-100">
                    Welcome to TomatoChat
                  </h1>
                  <h3 className="text-lg text-zinc-500">
                    There is no posts available in tomatochat
                  </h3>
                </div>
              </div>
            )}
            {newsfeedPosts && newsfeedPosts.pages.map((page: any, i: number) => (
              <React.Fragment key={i}>
                {page.newsfeed.map((post: any, i: number) => (
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
              className="flex flex-col items-center justify-center w-full space-y-2"
              ref={ref}
              onClick={() => fetchNextPage()}
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
      <AdsSuggestions user={user} />
    </div>
  )
}

export default NewsFeed