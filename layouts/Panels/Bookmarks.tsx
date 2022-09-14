import React from 'react'
import AdsSuggestions from './AdsSuggestions'
import CardPost from '../../components/Cards/CardPost'
import Spinner from '../../utils/Spinner'
import { useGetBookmarks } from '../../lib/ReactQuery'
import { useInView } from 'react-intersection-observer'
import { RiEmotionSadLine } from 'react-icons/ri'

interface IProps {
  user: any
  profile: any
}

const BookmarksPanel: React.FC<IProps> = ({ user, profile }) => {

  const { ref, inView } = useInView()

  const { data: bookmarks, isLoading: bookmarksLoading, isError: bookmarksError, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetBookmarks(String(user.id))

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, inView])

  return (
    <div className="inline-flex w-full max-w-full h-full overflow-hidden border-x border-zinc-300 dark:border-tomato-dark-secondary">
      <div className="flex flex-col items-center justify-start w-full max-w-full h-full p-4 space-y-2 overflow-y-scroll scroll-smooth scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
        <div className="inline-flex items-center justify-between w-full mb-2 px-3 text-neutral-600 dark:text-neutral-300">
          <h3 className="font-black text-2xl">Bookmarks</h3>
        </div>
        {bookmarksLoading && (
          <div className="flex flex-row items-center justify-center w-full h-full py-5">
            <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
              <Spinner width={40} height={40} color={'#F16506'} />
              <h3 className="font-light text-sm">Loading...</h3>
            </div>
          </div>
        )}
        {bookmarksError && (
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
        {!(bookmarksLoading && bookmarksError) && (
          <React.Fragment>
            {bookmarks && bookmarks.pages[0].bookmarks.length === 0 && (
              <div className="inline-flex items-center justify-center w-full h-full">
                <div className="flex flex-col items-start w-full max-w-md space-y-3">
                  <h1 className="font-black text-4xl text-zinc-800 dark:text-zinc-100">
                    {profile.name} has no bookmarks yet.
                  </h1>
                  <h3 className="text-lg text-zinc-500">When they do, their bookmarks will show up here.</h3>
                </div>
              </div>
            )}
            {bookmarks && bookmarks.pages.map((page: any, i: number) => (
              <React.Fragment key={i}>
                {page.bookmarks.map((bookmark: any, i: number) => (
                  <CardPost
                    key={i}
                    profile={profile}
                    user={user}
                    post={bookmark.post}                      
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
      <AdsSuggestions user={user} />
    </div>
  )
}

export default BookmarksPanel