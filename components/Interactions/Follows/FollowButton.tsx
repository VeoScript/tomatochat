import React from 'react'
import Spinner from '../../../utils/Spinner'
import { useForm } from 'react-hook-form'
import { useFollowUser } from '../../../lib/ReactQuery'

interface IProps {
  user: {
    id: string
  }
  profile: {
    id: string
  }
  size: string
}

const FollowButton: React.FC<IProps> = ({ user, profile, size }) => {

  const followUser = useFollowUser()

  const { handleSubmit, formState: { isSubmitting } } = useForm()

  const onFollow = async () => {
    const profileId = profile.id
    const userId = user.id

    await followUser.mutateAsync({
      profileId,
      userId
    })
  }

  return (
    <React.Fragment>
      {isSubmitting && (
        <div className={`inline-flex items-center justify-center ${size} space-x-2 outline-none px-3 py-2 rounded-md cursor-pointer text-center text-sm text-white bg-tomato-orange`}>
          <Spinner width={20} height={20} color={'#FFFFFF'} />
          <span>Loading...</span>
        </div>
      )}
      {!isSubmitting && (
        <button
          title="Follow"
          type="button"
          className={`${size} outline-none px-3 py-2 rounded-md text-sm text-white bg-tomato-orange transition ease-in-out duration-200 hover:bg-opacity-80`}
          onClick={handleSubmit(onFollow)}
        >
          Follow
        </button>
      )}
    </React.Fragment>
  )
}

export default FollowButton