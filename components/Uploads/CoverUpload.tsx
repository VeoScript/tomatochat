import React from 'react'
import DialogBox from '../Modals/DialogBox'
import CustomToaster from '../CustomToaster'
import Spinner from '../../utils/Spinner'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useChangeCoverMutation } from '../../lib/ReactQuery'
import { RiCameraFill } from 'react-icons/ri'

interface IProps {
  profile: any
}

const CoverUpload: React.FC<IProps> = ({ profile }) => {

  const changeCoverMutation = useChangeCoverMutation()

  const [previewCoverImage, setPreviewCoverImage] = React.useState<any>('')
  const [imageCoverUploaded, setImageCoverUploaded] = React.useState<any>('')

  const [isOpenCover, setisOpenCover] = React.useState(false)

  const { handleSubmit, formState: { isSubmitting } } = useForm()

  function closeModalCover() {
    setisOpenCover(false)
    setPreviewCoverImage('')
  }

  function openModalCover() {
    setisOpenCover(true)
    setPreviewCoverImage('')
  }

  const handleAddCoverImage = (e: any) => {
    try {
      setImageCoverUploaded(e.target.files[0])

      var file    = e.target.files[0]
      var reader  = new FileReader()
      var allowedExtensions = /(\.jpg|\.jpeg|\.jfif|\.png)$/i

      if(e.target.value !== '' && !allowedExtensions.exec(e.target.value)) {
        e.target.value = ''
        setImageCoverUploaded('')
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
        setImageCoverUploaded('')
        setPreviewCoverImage('')
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
        setPreviewCoverImage(reader.result)
      }

      if(file) {
        reader.readAsDataURL(file)
      } else {
        setPreviewCoverImage('')
      }

      openModalCover()
      
    } catch(error) {
      console.error(error)
    }
  }

  const onUpdateCover = async () => {
    try {
      let photo: string

      // check if there is selected photo, hence it will upload it to the gallery hosting
      if (imageCoverUploaded || previewCoverImage) {
        const body = new FormData()
        body.append('image', imageCoverUploaded)

        await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API}`, {
          method: 'POST',
          body: body
        })
        .then((response) => response.json())
        .then((result) => {
          photo = result.data.url
        })
        .then(async () => {
          await changeCoverMutation.mutateAsync({
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
              message={'Cover photo upload failed. Check your internet.'}
            />
          ))
        })
      }

      

      closeModalCover()

    } catch(err) {
      console.error(err)
    }
  }

  return (
    <React.Fragment>
      <label
        htmlFor="uploadCover"
        className="absolute right-3 bottom-3 inline-flex items-center space-x-1 p-2 z-10 cursor-pointer rounded-md text-white dark:text-black text-xs bg-black dark:bg-white bg-opacity-60 dark:bg-opacity-80 transition ease-in-out duration-200 hover:bg-opacity-50 dark:hover:bg-opacity-50"
      >
        <RiCameraFill className="w-4 h-4" />
        <span>Change Cover Photo</span>
      </label>
      <input
        type="file"
        id="uploadCover"
        className="hidden"
        onChange={handleAddCoverImage}
        accept=".jpg, .png, .jpeg, .jfif"
      />
      <DialogBox
        title="Update Cover Photo"
        maxWidth="max-w-4xl"
        className="outline-none"
        isOpen={isOpenCover}
        openModal={openModalCover}
        closeModal={closeModalCover}
        button=""
      >
        <div className="flex flex-col items-center justify-center w-full h-full max-h-[30rem] space-y-3 overflow-hidden">
          <img
            className="flex w-full h-[18rem] rounded-md bg-center object-cover bg-no-repeat"
            src={previewCoverImage}
            alt="Set Profile"
          />
          <div className="flex flex-col items-center w-full space-y-3">
            <span className="font-light text-xs">This will be the actual layout of your cover photo.</span>
            {!isSubmitting && (
              <button
                title="Create"
                type="button"
                className="outline-none w-full p-2 rounded-md text-sm text-white bg-tomato-orange transition ease-in-out duration-200 hover:bg-opacity-80"
                onClick={handleSubmit(onUpdateCover)}
              >
                Update Cover Photo
              </button>
            )}
            {isSubmitting && (
              <div className="inline-flex items-center justify-center w-full space-x-2 p-2 cursor-wait rounded-md text-sm text-white bg-tomato-orange bg-opacity-80">
                <Spinner
                  width={20}
                  height={20}
                  color={'#FFFFFF'}
                />
                <span className="font-light">Loading...</span>
              </div>
            )}
          </div>
        </div>
      </DialogBox>
    </React.Fragment>
  )
}

export default CoverUpload