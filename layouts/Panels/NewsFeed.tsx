import React from 'react'
import CardPost from '../../components/Cards/CardPost'
import CreatePost from '../../components/CreatePost'
import Spinner from '../../utils/Spinner'
import { useGetNewsFeedPosts } from '../../lib/ReactQuery'
import { useInView } from 'react-intersection-observer'
import { RiEmotionSadLine } from 'react-icons/ri'

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

  console.log(newsfeedPosts)

  return (
    <div className="inline-flex w-full max-w-full h-full overflow-hidden border-x border-zinc-300 dark:border-[#1F1836]">
      <div className="flex flex-col items-center justify-start w-full max-w-full h-full p-3 space-y-3 overflow-y-scroll scroll-smooth scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <CreatePost
          user={user}
          profile={profile}
        />
        {newsfeedLoading && (
          <div className="flex flex-row items-center justify-center w-full">
            <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
              <Spinner width={50} height={50} color={'#4D38A2'} />
              <h3 className="font-light text-sm">Loading...</h3>
            </div>
          </div>
        )}
        {newsfeedError && (
          <div className="flex flex-col items-center justify-center w-full space-y-2">
            <RiEmotionSadLine className="w-14 h-14" />
            <div className="inline-flex items-center justify-center w-full space-x-1 text-xs">
              <h3 className="font-light">Failed to load, try to</h3>
              <button
                type="button"
                className="outline-none font-bold text-[#6b50d8] hover:underline"
                onClick={() => refetch()}
              >
                Reload
              </button>
            </div>
          </div>
        )}
        {!(newsfeedLoading && newsfeedError) && (
          <React.Fragment>
            {newsfeedPosts && newsfeedPosts.pages[0].newsfeed.length === 0 && (
              <div className="inline-flex items-center justify-center w-full">
                <div className="flex flex-col items-start w-full max-w-md space-y-3">
                  <h1 className="font-black text-4xl text-zinc-800 dark:text-zinc-100">
                    {profile.name} has no posts yet.
                  </h1>
                  <h3 className="text-lg text-zinc-500">When they do, their posts will show up here.</h3>
                </div>
              </div>
            )}
            {newsfeedPosts && newsfeedPosts.pages.map((page: any, i: number) => (
              <React.Fragment key={i}>
                {page.newsfeed.map((post: any, i: number) => (
                  <CardPost
                    key={i}
                    profile={profile}
                    post={post}                      
                  />
                ))}
              </React.Fragment>
            ))}
            {isFetchingNextPage && (
              <div className="inline-flex justify-center w-full p-3">
                <Spinner width={30} height={30} color={'#4D38A2'} />
              </div>
            )}
            <details ref={ref} className="invisible">
              Intersecrion Observer Marker
            </details>
          </React.Fragment>
        )}
      </div>
      <div className="flex flex-col w-full max-w-xs h-full overflow-y-auto border-l border-zinc-300 dark:border-[#1F1836]">
        Suggestion
      </div>
    </div>
  )
}

export default NewsFeed