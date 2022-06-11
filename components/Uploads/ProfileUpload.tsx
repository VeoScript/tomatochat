import React from 'react'
import DialogBox from '../Modals/DialogBox'
import CustomToaster from '../CustomToaster'
import Spinner from '../../utils/Spinner'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useChangeProfileMutation } from '../../lib/ReactQuery'
import { RiCameraFill } from 'react-icons/ri'

interface IProps {
  profile: any
}

const ProfileUpload: React.FC<IProps> = ({ profile }) => {

  const changeProfileMutation = useChangeProfileMutation()

  const [previewProfileImage, setPreviewProfileImage] = React.useState<any>('')
  const [imageProfileUploaded, setImageProfileUploaded] = React.useState<any>('')

  const [isOpenProfile, setIsOpenProfile] = React.useState(false)

  const { handleSubmit, formState: { isSubmitting } } = useForm()

  function closeModal() {
    setIsOpenProfile(false)
    setPreviewProfileImage('')
  }

  function openModal() {
    setIsOpenProfile(true)
    setPreviewProfileImage('')
  }

  const handleAddProfileImage = (e: any) => {
    try {
      setImageProfileUploaded(e.target.files[0])

      var file    = e.target.files[0]
      var reader  = new FileReader()
      var allowedExtensions = /(\.jpg|\.jpeg|\.jfif|\.png)$/i

      if(e.target.value !== '' && !allowedExtensions.exec(e.target.value)) {
        e.target.value = ''
        setImageProfileUploaded('')
        toast.custom((trigger) => (
          <CustomToaster
            toast={toast}
            trigger={trigger}
            type={'Error'}
            message={'Please select jpg, jpeg or png only!'}
          />
        ))
        return
      }

      if(e.target.files[0].size > 2097152) {
        setImageProfileUploaded('')
        setPreviewProfileImage('')
        toast.custom((trigger) => (
          <CustomToaster
            toast={toast}
            trigger={trigger}
            type={'Info'}
            message={'Selected photo size exceeds 2 MB. Choose another one.'}
          />
        ))
        return
      }

      reader.onloadend = function () {
        setPreviewProfileImage(reader.result)
      }

      if(file) {
        reader.readAsDataURL(file)
      } else {
        setPreviewProfileImage('')
      }

      openModal()
      
    } catch(error) {
      console.error(error)
    }
  }

  const onUpdateProfile = async () => {
    try {
      let photo: string

      // check if there is selected photo, hence it will upload it to the gallery hosting
      if (imageProfileUploaded || previewProfileImage) {
        const body = new FormData()
        body.append('image', imageProfileUploaded)

        await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API}`, {
          method: 'POST',
          body: body
        })
        .then((response) => response.json())
        .then((result) => {
          photo = result.data.url
        })
        .then(async () => {
          await changeProfileMutation.mutateAsync({
            photo: String(photo),
            userId: String(profile.id)
          })
        })
        .catch(() => {
          toast.custom((trigger) => (
            <CustomToaster
              toast={toast}
              trigger={trigger}
              type={'Error'}
              message={'Profile photo upload failed. Check your internet.'}
            />
          ))
        })
      }

      closeModal()

    } catch(err) {
      console.error(err)
    }
  }

  return (
    <React.Fragment>
      <label
        htmlFor="uploadProfile"
        className="absolute right-3 bottom-3 inline-flex items-center space-x-1 p-2 z-10 cursor-pointer rounded-full text-white dark:text-black text-xs bg-black dark:bg-white bg-opacity-60 dark:bg-opacity-80 transition ease-in-out duration-200 hover:bg-opacity-50 dark:hover:bg-opacity-50"
      >
        <RiCameraFill className="w-4 h-4" />
      </label>
      <input
        type="file"
        id="uploadProfile"
        className="hidden"
        onChange={handleAddProfileImage}
        accept=".jpg, .png, .jpeg, .jfif"
      />
      <DialogBox
        title="Update Profile"
        maxWidth="max-w-md"
        className="outline-none"
        isOpen={isOpenProfile}
        openModal={openModal}
        closeModal={closeModal}
        button=""
      >
        <div className="flex flex-col items-center justify-center w-full h-full max-h-[30rem] space-y-3 overflow-hidden">
          <img
            className="flex w-[20rem] h-[20rem] rounded-full object-cover"
            src={previewProfileImage}
            alt="Set Profile"
          />
          <div className="inline-flex w-full space-x-2">
            {!isSubmitting && (
              <button
                title="Create"
                type="button"
                className="outline-none w-full p-2 rounded-md text-sm text-white bg-tomato-orange transition ease-in-out duration-200 hover:bg-opacity-80"
                onClick={handleSubmit(onUpdateProfile)}
              >
                Save Profile
              </button>
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
        </div>
      </DialogBox>
    </React.Fragment>
  )
}

export default ProfileUpload