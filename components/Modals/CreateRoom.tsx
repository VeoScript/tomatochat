import React from 'react'
import RoomImage from '../../components/Images/RoomImage'
import DialogBox from '../../components/Modals/DialogBox'
import CustomToaster from '../CustomToaster'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { RiAddLine, RiCameraFill , RiText, RiAlignRight, RiKey2Line } from 'react-icons/ri'

interface FormData {
  name: string
  privacy: string
  description: string
  password: string
  repassword: string
}

const CreateRoom = () => {

  let [isOpen, setIsOpen] = React.useState(false)
  let [isPrivate, setIsPrivate] = React.useState(false)

  const [previewImage, setPreviewImage] = React.useState<any>('')
  const [imageUploaded, setImageUploaded] = React.useState<any>('')

  const { handleSubmit, register, reset, formState: { errors, isSubmitting } } = useForm<FormData>()

  const openModal = () => {
    setIsOpen(true)
    setIsPrivate(false)
  }

  const closeModal = () => {
    reset()
    setIsOpen(false)
    setIsPrivate(false)
    setPreviewImage('')
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
            message={'Profile photo size exceeds 2 MB. Select another one.'}
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
      
    } catch(error) {
      console.error(error)
    }
  }

  const handleUploadImage = async () => {
    if (!imageUploaded) return

    try {
      const formData = new FormData()
      formData.append('image', imageUploaded)

      fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API}`, {
        method: 'POST',
        body: formData
      })

    } catch(err) {
      console.error(err)
    }
  }

  const onCreateRoom = async (formData: FormData) => {
    console.log(formData)
    handleUploadImage()
    closeModal()
  }

  return (
    <DialogBox
      title="Create Room"
      maxWidth="max-w-md"
      className="outline-none"
      isOpen={isOpen}
      openModal={openModal}
      closeModal={closeModal}
      button={<RiAddLine className="w-6 h-6 text-purple-500 transition ease-in-out duration-200 transform hover:scale-90" />}
    >
      <form onSubmit={handleSubmit(onCreateRoom)} className="flex flex-col items-start w-full space-y-2">
        <div className="inline-flex items-start w-full space-x-2">
          <div className="flex w-full max-w-[3rem]">
            <label title="Upload Photo" htmlFor="addImage" className="cursor-pointer">
              {previewImage ?
                  <RoomImage src={previewImage} />
                :
                  <div className="inline-flex items-center justify-center rounded-xl object-cover w-[50px] h-[50px] bg-[#201A2C] transition ease-in-out duration-200 hover:bg-white hover:bg-opacity-20">
                    <RiCameraFill  />
                  </div>
              }
            </label>
            <input
              type="file"
              id="addImage"
              className="hidden"
              onChange={handleAddImage}
              accept=".jpg, .png, .jpeg, .jfif"
            />
          </div>
          <div className="flex flex-col items-end w-full space-y-2">
            <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-400 bg-[#201A2C] border border-transparent focus-within:border-purple-600">
              <input
                type="text"
                className="w-full outline-none bg-transparent text-sm"
                placeholder="Name"
                {...register('name', { required: true })}
              />
              <RiText className="w-4 h-4" />
            </span>
            <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-400 bg-[#201A2C] border border-transparent focus-within:border-purple-600">
              <select
                className="w-full outline-none bg-[#201A2C] text-sm cursor-pointer"
                {...register('privacy', { required: true })}
                onInput={(e: any) => {
                  switch(e.currentTarget.value) {
                    case 'Private':
                      setIsPrivate(true)
                      break
                    case 'Public': 
                      setIsPrivate(false)
                      break
                    default:
                      setIsPrivate(false)
                  }
                }}
              >
                <option value="" className="hidden">Privacy Status</option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
              <RiKey2Line className="w-4 h-4" />
            </span>
          </div>
        </div>
        <div className="block w-full space-y-2">
          <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-400 bg-[#201A2C] border border-transparent focus-within:border-purple-600">
            <input
              type="text"
              className="w-full outline-none bg-transparent text-sm"
              placeholder="Description"
              {...register('description', { required: true })}
            />
            <RiAlignRight className="w-4 h-4" />
          </span>
          <div className="flex flex-col w-full space-y-2">
            {isPrivate && (
              <React.Fragment>
                <h3 className="text-xs ml-2">Create Passcode</h3>
                <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-400 bg-[#201A2C] border border-transparent focus-within:border-purple-600">
                  <input
                    type="password"
                    className="w-full outline-none bg-transparent text-sm"
                    placeholder="Password"
                    {...register('password', { required: true })}
                  />
                  <RiKey2Line className="w-4 h-4" />
                </span>
                <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-400 bg-[#201A2C] border border-transparent focus-within:border-purple-600">
                  <input
                    type="password"
                    className="w-full outline-none bg-transparent text-sm"
                    placeholder="Re-type Password"
                    {...register('repassword', { required: true })}
                  />
                  <RiKey2Line className="w-4 h-4" />
                </span>
              </React.Fragment>
            )}
            <div className="inline-flex w-full space-x-2">
              <button
                title="Create"
                type="submit"
                className="outline-none w-full p-2 rounded-md text-sm bg-purple-800 transition ease-in-out duration-200 hover:bg-opacity-80"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </form>
    </DialogBox>
  )
}

export default CreateRoom