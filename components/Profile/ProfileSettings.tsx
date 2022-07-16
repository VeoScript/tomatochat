import React from 'react'
import ProfileInfoCard from './ProfileInfoCard'
import Spinner from '../../utils/Spinner'
import CustomToaster from '../CustomToaster'
import { toast } from 'react-hot-toast'
import { useChangeUserAccountMutation, useAddUserHobbiesMutation, useDeleteUserHobbiesMutation } from '../../lib/ReactQuery'
import { useForm } from 'react-hook-form'
import { FcGoogle } from 'react-icons/fc'
import { RiUserLine, RiLink, RiMailLine, RiFacebookCircleFill, RiCloseLine } from 'react-icons/ri'

import { hobbies } from '../../static/hobbies'

interface IProps {
  user: any
  profile: any
}

interface AccountSettingFormData {
  name: string
  username: string
  email: string
}

const ProfileSettings: React.FC<IProps> = ({ user, profile }) => {

  const changeUserAccountMutation = useChangeUserAccountMutation()
  const addUserHobbiesMutation = useAddUserHobbiesMutation()
  const deleteUserHobbiesMutation = useDeleteUserHobbiesMutation()

  const [addedHobbies, setAddedHobbies] = React.useState<any>([{ name: '' }])

  // let finalHobbies
  let staticHobbies: any
  let profileHobbies: any

  for (var i = 0; i < hobbies.length; i++) {
    staticHobbies = hobbies[i]
    for (var j = 0; j < profile.hobbies.length; j++) {
      profileHobbies = profile.hobbies[j]
      console.log(hobbies.map((hobby: { name: string }) => hobby.name !== profileHobbies.name))
    }
  }

  // const staticHobbies = hobbies.find((hobby: { name: string }) => hobby.name)

  // // const initialHobbies = profile.hobbies.find((hobby: { name: string }) => hobby.name)

  // console.log(staticHobbies)
  // console.log(initialHobbies)

  const {
    handleSubmit: handleSubmitAccountSetting,
    register: registerAccountSetting,
    formState: {
      isSubmitting: isSubmittingAccountSetting
    }
  } = useForm<AccountSettingFormData>({
    defaultValues: {
      name: profile.name,
      username: profile.username,
      email: profile.email
    }
  })

  const {
    handleSubmit: handleSubmitHobbies,
    formState: {
      isSubmitting: isSubmittingHobbies
    }
  } = useForm()

  const onSaveAccountSetting = async (formData: AccountSettingFormData) => {
    await changeUserAccountMutation.mutateAsync({
      userId: user.id,
      name: formData.name,
      username: formData.username
    },
    {
      onError: (error) => {
        console.error(error)
      },
      onSuccess: () => {
        toast.custom((trigger) => (
          <CustomToaster
            toast={toast}
            trigger={trigger}
            type={'Success'}
            message={'Your account is updated successfully.'}
          />
        ))
      }
    })
  }

  const onAddHobby = async () => {
    await addUserHobbiesMutation.mutateAsync({
      hobbyName: String(addedHobbies[0].name),
      userId: user.id
    },
    {
      onError: (error) => {
        console.error(error)
      }
    })
  }

  return (
    <div className="relative flex flex-row items-start w-full max-w-full mt-[9rem] mb-[1rem] space-x-3">
      <ProfileInfoCard
        user={user}
        profile={profile}
      />
      <div className="inline-flex w-full max-w-full h-full overflow-hidden">
        <div className="flex flex-col items-center justify-start w-full max-w-full h-full space-y-5">
          <form onSubmit={handleSubmitAccountSetting(onSaveAccountSetting)} className="flex flex-col w-full space-y-2">
            <h3 className="font-bold text-base">Account Settings</h3>
            <div className="flex flex-col w-full space-y-2">
              <label htmlFor="name" className="font-light text-xs text-neutral-400 ml-1">Name</label>
              <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-800 dark:text-zinc-100 bg-tomato-light dark:bg-tomato-dark-secondary border border-transparent focus-within:border-tomato-orange">
                <input
                  id="name"
                  type="text"
                  className="w-full outline-none bg-transparent text-sm"
                  placeholder="Change your name"
                  {...registerAccountSetting('name', { required: true })}
                />
                <RiUserLine className="w-4 h-4 fill-current text-zinc-400" />
              </span>
            </div>
            <div className="flex flex-col w-full space-y-2">
              <label htmlFor="name" className="font-light text-xs text-neutral-400 ml-1">Username</label>
              <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-800 dark:text-zinc-100 bg-tomato-light dark:bg-tomato-dark-secondary border border-transparent focus-within:border-tomato-orange">
                <input
                  id="name"
                  type="text"
                  className="w-full outline-none bg-transparent text-sm"
                  placeholder="Create username"
                  {...registerAccountSetting('username')}
                />
                <RiLink className="w-4 h-4 fill-current text-zinc-400" />
              </span>
            </div>
            <div className="flex flex-col w-full space-y-2">
              <label htmlFor="email" className="font-light text-xs text-neutral-400 ml-1">Email</label>
              <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-800 dark:text-zinc-100 bg-tomato-light dark:bg-tomato-dark-secondary border border-transparent focus-within:border-tomato-orange">
                <input
                  id="email"
                  type="text"
                  className="w-full outline-none bg-transparent text-sm"
                  disabled
                  {...registerAccountSetting('email')}
                />
                <RiMailLine className="w-4 h-4 fill-current text-zinc-400" />
              </span>
            </div>
            <div className="flex pt-3 w-full">
              {isSubmittingAccountSetting && (
                <div className="inline-flex items-center justify-center w-full space-x-2 p-2 cursor-wait rounded-md text-sm text-white bg-tomato-orange bg-opacity-80">
                  <Spinner
                    width={20}
                    height={20}
                    color={'#FFFFFF'}
                  />
                  <span className="font-light">Saving...</span>
                </div>
              )}
              {!isSubmittingAccountSetting && (
                <React.Fragment>
                  <button
                    type="submit"
                    className="outline-none w-full p-2 rounded-md text-sm text-white bg-tomato-orange transition ease-in-out duration-200 hover:bg-opacity-80"
                  >
                    Save
                  </button>
                </React.Fragment>
              )}
            </div>
          </form>
          <div className="flex flex-col w-full space-y-2">
            <h3 className="font-bold text-base">Hobbies</h3>
            <div className="flex flex-col w-full space-y-2">
              <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-800 dark:text-zinc-100 bg-tomato-light dark:bg-tomato-dark-secondary border border-transparent focus-within:border-tomato-orange">
                <select
                  id="hobbies"
                  className="w-full outline-none cursor-pointer bg-transparent text-sm"
                  onChange={(e) => {
                    setAddedHobbies([{
                      name: e.currentTarget.value
                    }])
                  }}
                >
                  <option
                    value=""
                    className="bg-white dark:bg-tomato-dark-slight"
                  ></option>
                  {hobbies.map((hobby: { name: string }, i: number) => (
                    <option 
                      key={i}
                      className="bg-white dark:bg-tomato-dark-slight"
                      value={`${hobby.name}`}
                    >
                      {hobby.name}
                    </option>
                  ))}
                </select>
                {addedHobbies[0].name !== '' && (
                  <React.Fragment>
                    {isSubmittingHobbies && (
                      <span className="px-2 py-1 rounded-lg text-white bg-tomato-orange-secondary outline-none font-normal text-xs hover:bg-opacity-80">
                        Adding...
                      </span>
                    )}
                    {!isSubmittingHobbies && (
                      <button
                        type="button"
                        className="px-2 py-1 rounded-lg text-white bg-tomato-orange-secondary outline-none font-normal text-xs hover:bg-opacity-80"
                        onClick={handleSubmitHobbies(onAddHobby)}
                      >
                        Add
                      </button>
                    )}
                  </React.Fragment>
                )}
              </span>
            </div>
            <div className="grid grid-cols-5 items-start gap-2">
              {profile.hobbies.map((hobby: { id: string, name: string }) => (
                <p
                  key={hobby.id}
                  className="inline-flex items-center justify-between w-full px-3 py-1 rounded-full text-xs text-center text-white cursor-default bg-tomato-orange"
                >
                  <span>{hobby.name}</span>
                  <button
                    type="button"
                    className="outline-none"
                    onClick={async () => {
                      await deleteUserHobbiesMutation.mutateAsync({
                        hobbyId: hobby.id
                      })
                    }}
                  >
                    <RiCloseLine className="w-4 h-4 text-tomato-dark transition ease-in-out duration-100 transform hover:scale-95" />
                  </button>
                </p>
              ))}
            </div>
          </div>
          <div className="flex flex-col w-full space-y-2">
            <h3 className="font-bold text-base">Logged in Account</h3>
            {profile.accounts[0].provider === 'facebook' && (
              <div className="flex flex-row items-center w-full px-5 py-3 space-x-2 rounded-xl bg-white">
                <RiFacebookCircleFill className="w-10 h-10 fill-current text-blue-600" />
                <h3 className="font-light text-sm text-tomato-dark">
                  You are logged in using your Facebook Account.
                </h3>
              </div>
            )}
            {profile.accounts[0].provider === 'google' && (
              <div className="flex flex-row items-center w-full px-5 py-3 space-x-2 rounded-xl bg-white">
                <FcGoogle className="w-10 h-10" />
                <h3 className="font-light text-sm text-tomato-dark">
                  You are logged in using your Google Account.
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings