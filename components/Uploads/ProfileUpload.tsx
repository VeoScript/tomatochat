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

  const [previewImage, setPreviewImage] = React.useState<any>('')
  const [imageUploaded, setImageUploaded] = React.useState<any>('')

  const [isOpen, setIsOpen] = React.useState(false)

  const { handleSubmit, formState: { isSubmitting } } = useForm()

  function closeModal() {
    setIsOpen(false)
    setPreviewImage('')
    setImageUploaded('')
  }

  function openModal() {
    setIsOpen(true)
  }

  const handleAddImage = (e: any) => {
    try {
      setImageUploaded(e.target.files[0])

      var file    = e.target.files[0]
      var reader  = new FileReader()
      var allowedExtensions = /(\.jpg|\.jpeg|\.jfif|\.png)$/i

      if(e.target.value !== '' && !allowedExtensions.exec(e.target.value)) {
        e.target.value = ''
        setImageUploaded('')
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
        setImageUploaded('')
        setPreviewImage('')
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
        setPreviewImage(reader.result)
      }

      if(file) {
        reader.readAsDataURL(file)
      } else {
        setPreviewImage('')
      }

      openModal()
      
    } catch(error) {
      console.error(error)
    }
  }

  const onUpdateProfile = async () => {
    try {
      let photo

      // check if there is selected photo, hence it will upload it to the gallery hosting
      if (imageUploaded || previewImage) {
        const body = new FormData()
        body.append('image', imageUploaded)

        await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API}`, {
          method: 'POST',
          body: body
        })
        .then((response) => response.json())
        .then((result) => {
          photo = result.data.url
        })
        .catch(() => {
          console.error('Upload Failed')
        })
      }

      await changeProfileMutation.mutateAsync({
        photo: String(photo),
        userId: String(profile.id)
      })

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
        onChange={handleAddImage}
        accept=".jpg, .png, .jpeg, .jfif"
      />
      <DialogBox
        title="Update Profile"
        maxWidth="max-w-md"
        className="outline-none"
        isOpen={isOpen}
        openModal={openModal}
        closeModal={closeModal}
        button=""
      >
        <div className="flex flex-col items-center justify-center w-full h-full max-h-[30rem] space-y-3 overflow-y-scroll scroll-smooth scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
          <img
            className="flex w-[20rem] h-[20rem] rounded-full object-cover"
            src={previewImage}
            alt="Set Profile"
          />
          <div className="inline-flex w-full space-x-2">
            {!isSubmitting && (
              <button
                title="Create"
                type="button"
                className="outline-none w-full p-2 rounded-md text-sm text-white bg-purple-800 transition ease-in-out duration-200 hover:bg-opacity-80"
                onClick={handleSubmit(onUpdateProfile)}
              >
                Save Profile
              </button>
            )}
            {isSubmitting && (
              <div className="inline-flex items-center justify-center w-full space-x-2 p-2 cursor-wait rounded-md text-sm text-white bg-purple-800 bg-opacity-80">
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