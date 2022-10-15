import React from 'react'

const PostCardSkeleton = () => {
  
  let skeletonCount = [1, 2, 3]

  return (
    <React.Fragment>
      {skeletonCount.map((count: any) => (
        <div key={count} className="flex flex-col w-full p-5 space-y-5 back-shadow rounded-xl bg-white dark:bg-tomato-dark-slight">
          <div className="animate-pulse flex w-full space-x-4">
            <div className="flex flex-col">
              <div className="rounded-full bg-neutral-300 dark:bg-neutral-500 h-12 w-12"></div>
            </div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 w-52 bg-neutral-300 dark:bg-neutral-500 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-neutral-300 dark:bg-neutral-500 rounded col-span-2"></div>
                  <div className="h-2 bg-neutral-300 dark:bg-neutral-500 rounded col-span-1"></div>
                  <div className="h-2 bg-neutral-300 dark:bg-neutral-500 rounded col-span-3"></div>
                  <div className="h-2 bg-neutral-300 dark:bg-neutral-500 rounded col-span-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </React.Fragment>
  )
}

export default PostCardSkeleton