import React from 'react'
import Spinner from '../../../utils/Spinner'
import { useForm } from 'react-hook-form'
import { useUnfollowUser } from '../../../lib/ReactQuery'

interface IProps {
  user: {
    id: string
  }
  profile: {
    id: string
  }
  size: string
}

const UnfollowButton: React.FC<IProps> = ({ user, profile, size }) => {

  const unfollowUser = useUnfollowUser()

  const { handleSubmit, formState: { isSubmitting } } = useForm()

  const onFollow = async () => {
    const profileId = profile.id
    const userId = user.id

    await unfollowUser.mutateAsync({
      profileId,
      userId
    })
  }

  return (
    <React.Fragment>
      {isSubmitting && (
        <div className={`inline-flex items-center justify-center ${size} space-x-2 outline-none px-3 py-2 rounded-md cursor-pointer text-center text-sm text-white bg-red-600`}>
          <Spinner width={20} height={20} color={'#FFFFFF'} />
          <span>Loading...</span>
        </div>
      )}
      {!isSubmitting && (
        <button
          title="Follow"
          type="button"
          className={`unfollow_button ${size} outline-none px-3 py-2 rounded-md text-sm text-white bg-tomato-orange transition ease-in-out duration-200 hover:bg-red-600`}
          onClick={handleSubmit(onFollow)}
        >
          <span>Following</span>
        </button>
      )}
    </React.Fragment>
  )
}

export default UnfollowButton