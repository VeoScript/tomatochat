import React from 'react'
import { RiHeart3Fill } from 'react-icons/ri'
import { useLikePost, useUnlikePost } from '../../lib/ReactQuery'

interface IProps {
  user: {
    id: string
  }
  post: {
    id: string
    likes: [{
      userId: string
    }]
  }
}

const LikeButton: React.FC<IProps> = ({ user, post }) => {

  const likePost = useLikePost()
  const unlikePost = useUnlikePost()

  const userId = user.id
  const postId = post.id
  const likes = post.likes

  // useState check if the post is liked
  const [like, setLike] = React.useState(false)

  // i am using useEffect hook for update the likes state if there is a new post...
  React.useEffect(() => {
    // if this (likes.some) is true, setLike state will turn to true...
    setLike(likes.some((liked: { userId: string }) => liked.userId === user.id))
  }, [user.id, likes])

  // function for liking the post
  async function onLike(postId: string) {
    await likePost.mutateAsync({
      userId,
      postId
    })
  }

  // function for unliking the post
  async function onUnlike(postId: string) {
    await unlikePost.mutateAsync({
      userId,
      postId
    })
  }

  return (
    <button
      title="Reaction"
      className="outline-none transition ease-in-out duration-200 transform hover:scale-90"
      onClick={async () => {
      like ? await onUnlike(postId) : await onLike(postId)
      setLike(!like)
    }}>
      {like ? (
          <RiHeart3Fill className="w-6 h-6 text-red-600 focus:text-neutral-400" />
        ) : (
          <RiHeart3Fill className="w-6 h-6 text-neutral-400 focus:text-red-600" />
        )
      }
    </button>
  )
}

export default LikeButton