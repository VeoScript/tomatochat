import React from 'react'
import DialogBox from '../DialogBox'
import Spinner from '../../../utils/Spinner'
import CustomToaster from '../../CustomToaster'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useChangeSocMedMutation } from '../../../lib/ReactQuery'
import { RiEdit2Line, RiLinkedinFill } from 'react-icons/ri'
import { Facebook, Instagram, Twitter, TikTok, Youtube } from '../../../utils/SocialMediaIcons'

interface IProps {
  profile: any
}

interface SocMedFormData {
  facebook: string
  instagram: string
  linkedin: string
  twitter: string
  tiktok: string
  youtube: string
}

const UpdateSocialMediaLinks: React.FC<IProps> = ({ profile }) => {

  const changeSocMedMutation = useChangeSocMedMutation()

  let [isOpen, setIsOpen] = React.useState(false)

  const defaultValues = {
    facebook: profile.facebook,
    instagram: profile.instagram,
    linkedin: profile.linkedin,
    twitter: profile.twitter,
    tiktok: profile.tiktok,
    youtube: profile.youtube
  }

  const { handleSubmit, register, reset, formState: { isSubmitting } } = useForm<SocMedFormData>({ defaultValues })

  const openModal = () => {
    setIsOpen(true)
    reset(defaultValues)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const onChangeSocMed = async (formData: SocMedFormData) => {
    await changeSocMedMutation.mutateAsync({
      userId: profile.id,
      facebook: formData.facebook,
      instagram: formData.instagram,
      linkedin: formData.linkedin,
      twitter: formData.twitter,
      tiktok: formData.tiktok,
      youtube: formData.youtube
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
            message={'Social media links updated successfully.'}
          />
        ))
        closeModal()
      }
    })
  }

  return (
    <DialogBox 
      title="Edit Social Media Links"
      isOpen={isOpen} 
      openModal={openModal} 
      closeModal={closeModal} 
      className="outline-none flex w-full"
      maxWidth="max-w-md"
      button={
        <div className="outline-none transition ease-in-out duration-100 transform hover:scale-95">
          <RiEdit2Line className="w-4 h-4 text-neutral-400" />
        </div>
      } 
    >
      <form onSubmit={handleSubmit(onChangeSocMed)} className="flex flex-col items-center justify-center w-full space-y-5 text-sm">
        <div className="flex flex-col w-full space-y-2">
          <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-800 dark:text-zinc-100 bg-tomato-light dark:bg-tomato-dark-secondary border border-transparent focus-within:border-tomato-orange">
            <input
              type="text"
              className="w-full outline-none bg-transparent text-sm"
              placeholder="Facebook Username"
              {...register('facebook')}
            />
            <Facebook className="w-4 h-4 fill-current text-zinc-400" />
          </span>
          <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-800 dark:text-zinc-100 bg-tomato-light dark:bg-tomato-dark-secondary border border-transparent focus-within:border-tomato-orange">
            <input
              type="text"
              className="w-full outline-none bg-transparent text-sm"
              placeholder="Instagram Username"
              {...register('instagram')}
            />
            <Instagram className="w-4 h-4 fill-current text-zinc-400" />
          </span>
          <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-800 dark:text-zinc-100 bg-tomato-light dark:bg-tomato-dark-secondary border border-transparent focus-within:border-tomato-orange">
            <input
              type="text"
              className="w-full outline-none bg-transparent text-sm"
              placeholder="Twitter Username"
              {...register('twitter')}
            />
            <Twitter className="w-4 h-4 fill-current text-zinc-400" />
          </span>
          <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-800 dark:text-zinc-100 bg-tomato-light dark:bg-tomato-dark-secondary border border-transparent focus-within:border-tomato-orange">
            <input
              type="text"
              className="w-full outline-none bg-transparent text-sm"
              placeholder="TikTok Username"
              {...register('tiktok')}
            />
            <TikTok className="w-4 h-4 fill-current text-zinc-400" />
          </span>
          <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-800 dark:text-zinc-100 bg-tomato-light dark:bg-tomato-dark-secondary border border-transparent focus-within:border-tomato-orange">
            <input
              type="text"
              className="w-full outline-none bg-transparent text-sm"
              placeholder="LinkedIn URL"
              {...register('linkedin')}
            />
            <RiLinkedinFill className="w-4 h-4 fill-current text-zinc-400" />
          </span>
          <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-800 dark:text-zinc-100 bg-tomato-light dark:bg-tomato-dark-secondary border border-transparent focus-within:border-tomato-orange">
            <input
              type="text"
              className="w-full outline-none bg-transparent text-sm"
              placeholder="YouTube URL"
              {...register('youtube')}
            />
            <Youtube className="w-4 h-4 fill-current text-zinc-400" />
          </span>
        </div>
        <div className="inline-flex items-center w-full space-x-2">
          {!isSubmitting && (
            <React.Fragment>
              <button
                type="submit"
                className="outline-none w-full p-2 rounded-md text-sm text-white bg-tomato-orange transition ease-in-out duration-200 hover:bg-opacity-80"
              >
                Save
              </button>
              <button
                type="button"
                className="outline-none w-full p-2 rounded-md text-sm text-white bg-tomato-dark-secondary transition ease-in-out duration-200 hover:bg-opacity-80"
                onClick={closeModal}
              >
                Cancel
              </button>
            </React.Fragment>
          )}
          {isSubmitting && (
            <div className="inline-flex items-center justify-center w-full space-x-2 p-2 cursor-wait rounded-md text-sm text-white bg-tomato-orange bg-opacity-80">
              <Spinner
                width={20}
                height={20}
                color={'#FFFFFF'}
              />
              <span className="font-light">Saving...</span>
            </div>
          )}
        </div>
      </form>
    </DialogBox>
  )
}

export default UpdateSocialMediaLinks