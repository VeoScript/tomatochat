import error from 'next/error'
import React from 'react'
import toast from 'react-hot-toast'
import CustomToaster from '../CustomToaster'
import { RiBookmarkFill } from 'react-icons/ri'
import { useAddToBookmark, useDeleteToBookmark } from '../../lib/ReactQuery'

interface IProps {
  user: {
    id: string
  }
  post: {
    id: string
    bookmarks: [{
      userId: string
    }]
  }
}

const BookmarkButton: React.FC<IProps> = ({ user, post }) => {

  const addToBookmark = useAddToBookmark()
  const deleteToBookmark = useDeleteToBookmark()

  const userId = user.id
  const postId = post.id
  const bookmarks = post.bookmarks

  // useState check if the post is bookmarkd
  const [bookmark, setBookmark] = React.useState(false)

  // i am using useEffect hook for update the bookmarks state if there is a new post...
  React.useEffect(() => {
    // if this (bookmarks.some) is true, setBookmark state will turn to true...
    setBookmark(bookmarks.some((bookmarked: { userId: string }) => bookmarked.userId === user.id))
  }, [user.id, bookmarks])

  // function for adding the post to bookmark
  async function onAddToBookmark(postId: string) {
    await addToBookmark.mutateAsync({
      userId,
      postId
    },
    {
      onSuccess: () => {
        toast.custom((trigger) => (
          <CustomToaster
            toast={toast}
            trigger={trigger}
            type={'Success'}
            message={'Saved to bookmarks successfully.'}
          />
        ))
      }
    })
  }

  // function for removing the post on bookmark
  async function onDeleteToBookmark(postId: string) {
    await deleteToBookmark.mutateAsync({
      userId,
      postId
    },
    {
      onSuccess: () => {
        toast.custom((trigger) => (
          <CustomToaster
            toast={toast}
            trigger={trigger}
            type={'Info'}
            message={'Removed to your bookmarks successfully.'}
          />
        ))
      }
    })
  }

  return (
    <button
      title="Reaction"
      className="outline-none transition ease-in-out duration-200 transform hover:scale-90"
      onClick={async () => {
      bookmark ? await onDeleteToBookmark(postId) : await onAddToBookmark(postId)
      setBookmark(!bookmark)
    }}>
      {bookmark ? (
          <RiBookmarkFill className="w-6 h-6 text-blue-500 focus:text-neutral-400" />
        ) : (
          <RiBookmarkFill className="w-6 h-6 text-neutral-400 focus:text-blue-500" />
        )
      }
    </button>
  )
}

export default BookmarkButton