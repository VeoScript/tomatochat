import React from 'react'
import Link from 'next/link'
import UpdateSocialMediaLinks from '../Modals/Body/UpdateSocialMediaLinks'
import CustomToaster from '../CustomToaster'
import { useChangeBioMutation } from '../../lib/ReactQuery'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { RiCloseLine, RiEdit2Line, RiLinkedinFill } from 'react-icons/ri'
import { Facebook, Instagram, Twitter, TikTok, Youtube } from '../../utils/SocialMediaIcons'

interface IProps {
  user: any
  profile: any
}

interface BioFormData {
  bio: string
}

const ProfileInfoCard: React.FC<IProps> = ({ user, profile }) => {

  const changeBioMutation = useChangeBioMutation()

  const [isEditIntro, setIsEditIntro] = React.useState(false)

  const { handleSubmit: handleSubmitBio, register: registerBio, reset: resetBio, formState: { isSubmitting: isSubmittingBio } } = useForm<BioFormData>()

  const onChangeBio = async (formData: BioFormData) => {
    await changeBioMutation.mutateAsync({
      bio: formData.bio,
      userId: user.id
    },
    {
      onError: (error) => {
        console.error(error)
      },
      onSuccess: () => {
        setIsEditIntro(false)
        toast.custom((trigger) => (
          <CustomToaster
            toast={toast}
            trigger={trigger}
            type={'Success'}
            message={'Bio updated successfully.'}
          />
        ))
      }
    })
  }

  return (
    <div className="sticky top-2 flex flex-col w-full max-w-xs p-5 space-y-3 rounded-xl back-shadow bg-neutral-100 dark:bg-tomato-dark-slight">
      <div className="flex flex-col">
        <div className="inline-flex items-center justify-between w-full">
          <h2 className="font-bold text-lg text-zinc-700 dark:text-neutral-500">
            {!isEditIntro ? 'Intro' : 'Update Intro'}
          </h2>
          {(!isEditIntro && user.id === profile.id) && (
            <button
              type="button"
              className="outline-none transition ease-in-out duration-100 transform hover:scale-95"
              onClick={() => {
                setIsEditIntro(true)
              }}
            >
              <RiEdit2Line className="w-4 h-4 text-neutral-400" />
            </button>
          )}
          {isEditIntro && (
            <button
              type="button"
              className="outline-none transition ease-in-out duration-100 transform hover:scale-95"
              onClick={() => {
                setIsEditIntro(false)
                resetBio({
                  bio: profile.bio
                })
              }}
            >
              <RiCloseLine className="w-4 h-4 text-neutral-400" />
            </button>
          )}
        </div>
        {!isEditIntro && (
          <h3 className="font-normal text-sm">
            {profile.bio === null ? 'Welcome to TomatoChat' : profile.bio}
          </h3>
        )}
        {isEditIntro && (
          <div className="inline-flex w-full mt-1">
            <input
              type="text"
              placeholder="Your bio"
              defaultValue={profile.bio}
              className="w-full outline-none bg-transparent font-normal text-sm"
              {...registerBio('bio', { required: true })}
            />
            {isSubmittingBio && (
              <div className="px-2 py-1 rounded-lg text-white bg-tomato-orange-secondary outline-none font-normal text-xs hover:bg-opacity-80">
                Saving
              </div>
            )}
            {!isSubmittingBio && (
              <button
                type="button"
                className="px-2 py-1 rounded-lg text-white bg-tomato-orange-secondary outline-none font-normal text-xs hover:bg-opacity-80"
                onClick={handleSubmitBio(onChangeBio)}
              >
                Save
              </button>
            )}
          </div>
        )}
      </div>
      {profile.hobbies.length > 0 && (
        <div className="flex flex-col">
          <h2 className="font-bold text-lg text-zinc-700 dark:text-neutral-500">Hobbies</h2>
          <div className="inline w-full">
            {profile.hobbies.map((hobby: { id: string, name: string }) => (
              <p
                key={hobby.id}
                className="inline-flex items-center justify-center mx-0.5 my-0.5 px-3 py-1 rounded-full text-xs text-center text-white cursor-default bg-tomato-orange"
              >
                <span>{hobby.name}</span>
              </p>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col space-y-2">
        <div className="inline-flex items-center justify-between w-full">
          <h2 className="font-bold text-lg text-zinc-700 dark:text-neutral-500">Social Links</h2>
          <div className="flex">
            {user.id === profile.id && (
              <UpdateSocialMediaLinks profile={profile} />
            )}
          </div>
        </div>
        {(!profile.facebook) && (
          <p className="font-normal text-sm text-zinc-600 dark:text-neutral-500">
            No social media links.
          </p>
        )}
        {profile.facebook && (
          <Link href={`https://www.facebook.com/${profile.facebook}`}>
            <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-tomato-orange" target="_blank">
              <Facebook className="w-4 h-4 fill-current text-zinc-500" />
              <span className="font-normal text-sm">
                @{profile.facebook}
              </span>
            </a>
          </Link>
        )}
        {profile.instagram && (
          <Link href={`https://www.instagram.com/${profile.instagram}`}>
            <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-tomato-orange" target="_blank">
              <Instagram className="w-4 h-4 fill-current text-zinc-500" />
              <span className="font-normal text-sm">
                @{profile.instagram}
              </span>
            </a>
          </Link>
        )}
        {profile.twitter && (
          <Link href={`https://www.twitter.com/${profile.twitter}`}>
            <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-tomato-orange" target="_blank">
              <Twitter className="w-4 h-4 fill-current text-zinc-500" />
              <span className="font-normal text-sm">
                @{profile.twitter}
              </span>
            </a>
          </Link>
        )}
        {profile.tiktok && (
          <Link href={`https://www.tiktok.com/${profile.tiktok}`}>
            <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-tomato-orange" target="_blank">
              <TikTok className="w-4 h-4 fill-current text-zinc-500" />
              <span className="font-normal text-sm">
                @{profile.tiktok}
              </span>
            </a>
          </Link>
        )}
        {profile.linkedin && (
          <Link href={`${profile.linkedin}`}>
            <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-tomato-orange" target="_blank">
              <RiLinkedinFill className="w-4 h-4 fill-current text-zinc-500" />
              <span className="font-normal text-sm">
                LinkedIn
              </span>
            </a>
          </Link>
        )}
        {profile.youtube && (
          <Link href={`${profile.youtube}`}>
            <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-tomato-orange" target="_blank">
              <Youtube className="w-4 h-4 fill-current text-zinc-500" />
              <span className="font-normal text-sm">
                YouTube
              </span>
            </a>
          </Link>
        )}
      </div>
    </div>
  )
}

export default ProfileInfoCard