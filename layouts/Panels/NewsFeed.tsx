import React from 'react'
import CardPost from '../../components/Cards/CardPost'
import CreatePost from '../../components/CreatePost'
import Spinner from '../../utils/Spinner'
import { useGetNewsFeedPosts } from '../../lib/ReactQuery'
import { useInView } from 'react-intersection-observer'
import { RiAlarmWarningFill, RiEmotionSadLine, RiFilter2Fill } from 'react-icons/ri'

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
    <div className="inline-flex w-full max-w-full h-full overflow-hidden border-x border-zinc-300 dark:border-tomato-dark-secondary">
      <div className="flex flex-col items-center justify-start w-full max-w-full h-full p-4 space-y-2 overflow-y-scroll scroll-smooth scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
        <div className="inline-flex items-center justify-between w-full mb-2 px-3 text-neutral-600 dark:text-neutral-300">
          <h3 className="font-black text-2xl">Newsfeed</h3>
          <button
            title="Filter"
            type="button"
            className="outline-none"
          >
            <RiFilter2Fill className="w-6 h-6" />
          </button>
        </div>
        <CreatePost
          user={user}
          profile={profile}
        />
        {newsfeedLoading && (
          <div className="flex flex-row items-center justify-center w-full py-5">
            <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
              <Spinner width={40} height={40} color={'#F16506'} />
              <h3 className="font-light text-sm">Loading...</h3>
            </div>
          </div>
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
              ref={ref}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? <Spinner width={40} height={40} color={'#F16506'} />
                : hasNextPage
                ? 'Fetching new posts...'
                : ''}
            </button>
          </React.Fragment>
        )}
      </div>
      <div className="flex flex-col w-full max-w-xs h-full overflow-y-auto border-l border-zinc-300 dark:border-tomato-dark-secondary">
        <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
          <RiAlarmWarningFill className="w-10 h-10 text-tomato-orange" />
          <h3 className="font-bold">Under Maintenance</h3>
        </div>
      </div>
    </div>
  )
}

export default NewsFeed