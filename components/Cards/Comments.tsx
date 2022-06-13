import React from 'react'
import PostProfile from '../Images/PostProfile'
import Spinner from '../../utils/Spinner'
import { useForm } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'
import { useGetPostComments, useCommentPost, useGetTotalComments } from '../../lib/ReactQuery'
import { RiEmotionSadLine } from 'react-icons/ri'

interface IProps {
  post: {
    id: string
  }
  user: {
    id: string
  }
}

interface FormData {
  commentbox: string
}

const Comments: React.FC<IProps> = ({ post, user }) => {

  const commentPost = useCommentPost()
  const { data: totalComments, isLoading: totalCommentsLoading } = useGetTotalComments(String(post.id))
  const { data: comments, isLoading: commentsLoading, isError: commentsError, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetPostComments(String(post.id))

  const { ref, inView } = useInView()

  const { handleSubmit, register, reset, setValue, formState: { isSubmitting } } = useForm<FormData>()

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    } 
    register('commentbox', { required: true })
  }, [refetch, register, fetchNextPage, hasNextPage, inView])

  const onSendComment = async (formData: FormData) => {
    const message = formData.commentbox
    const postId = post.id
    const userId = user.id
    const commentbox = document.getElementById('commentbox')

    await commentPost.mutateAsync({
      message,
      postId,
      userId
    },
    {
      onError: async () => {
        console.error('Unsuccessful to send comment, check your internet')
      },
      onSuccess: async () => {
        console.log('Comment send successfully')
      }
    })

    reset()
    commentbox !== null ?
    commentbox.innerHTML = '' : ''
    commentbox?.focus()
  }

  const handleCtrlEnter = (e: any) => {
    if (e.ctrlKey) {
      e.preventDefault()
      handleSubmit(onSendComment)()
    }
  }

  return (
    <div className="relative flex flex-col w-full space-y-5">
      <div className="flex flex-row items-center justify-between w-full">
        <h3 className="font-bold text-lg">Comments</h3>
        <h4 className="font-light text-sm">
          {totalCommentsLoading ? <Spinner width={20} height={20} color={'#F16506'} /> : `${totalComments} Comments`}
        </h4>
      </div>
      <div className="flex flex-col w-full space-y-1">
        <div className="flex flex-col w-full h-[23.5rem] overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          {commentsLoading && (
            <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
              <Spinner width={30} height={30} color={'#F16506'} />
              <h3 className="font-light text-sm">Loading...</h3>
            </div>
          )}
          {commentsError && (
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
          {comments?.pages[0].comments.length == 0 && (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <h3 className="font-light text-sm text-neutral-400">There is no comments yet.</h3>
            </div>
          )}
          <ul className="mr-3 space-y-1">
            {comments?.pages.map((page: any, i: number) => (
              <React.Fragment key={i}>
                {page.comments.map((comment: { index: number, id: string, message: string, createdAt: Date, user: { id: string, image: string, name: string } }) => (
                  <li key={comment.index} className="flex flex-col p-3 rounded-md bg-tomato-dark-slight">
                    <div className="inline-flex items-start space-x-3">
                      <PostProfile src={comment.user.image} />
                      <div className="flex flex-col space-y-1">
                        <h3 className="font-bold text-base">{comment.user.name}</h3>
                        <p className="font-light text-sm whitespace-pre-wrap">{comment.message}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
          <div className="inline-flex items-center justify-center w-full pb-3 text-xs text-tomato-orange">
            <button
              ref={ref}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? <Spinner width={40} height={40} color={'#F16506'} />
                : hasNextPage
                ? 'Load more comments...'
                : ''}
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSendComment)} className="flex flex-row items-start w-full px-5 py-3 space-x-3 rounded-md bg-zinc-100 dark:bg-tomato-dark-secondary border border-transparent dark:border-transparent focus-within:border-transparent dark:focus-within:border-tomato-orange">
          <div
            id="commentbox"
            className="w-full h-full max-h-[15rem] mt-0.5 overflow-y-auto cursor-text whitespace-pre-wrap outline-none font-normal text-sm"
            placeholder="(Ctrl+Enter) to submit your comment..."
            title="Shift+Enter to execute new line."
            contentEditable="true"
            suppressContentEditableWarning
            spellCheck={false}
            onKeyPress={handleCtrlEnter}
            onPaste={(e) => {
              e.preventDefault()
              var text = e.clipboardData.getData('text/plain')
              document.execCommand('insertText', false, text)
            }}
            onInput={(e: any) => setValue('commentbox', e.currentTarget.textContent, { shouldValidate: true })}
          />
          {!isSubmitting && (
            <button
              type="submit"
              className="outline-none text-sm text-tomato-orange"
            >
              Send
            </button>
          )}
          {isSubmitting && (
            <span className="text-sm text-tomato-orange cursor-wait select-none">Sending...</span>
          )}
        </form>  
      </div>
    </div>
  )
}

export default Comments