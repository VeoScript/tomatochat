import React from 'react'
import Router from 'next/router'
import RoomImage from '../../Images/RoomImage'
import DialogBox from '../DialogBox'
import CustomToaster from '../../CustomToaster'
import Spinner from '../../../utils/Spinner'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useCreateRoomMutation, useSendChatJoinMutation, useLastChatMutation } from '../../../lib/ReactQuery'
import { RiAddLine, RiCameraFill , RiText, RiAlignRight, RiKey2Line } from 'react-icons/ri'

interface IProps {
  user: any
}

interface FormData {
  name: string
  privacy: string
  description: string
  password: string
  repassword: string
}

const CreateRoom: React.FC<IProps> = ({ user }) => {

  const createRoomMutation = useCreateRoomMutation()
  const sendChatJoinMutation = useSendChatJoinMutation()
  const lastChat = useLastChatMutation()

  let [isOpen, setIsOpen] = React.useState(false)
  let [isPrivate, setIsPrivate] = React.useState(false)

  const [previewImage, setPreviewImage] = React.useState<any>('')
  const [imageUploaded, setImageUploaded] = React.useState<any>('')

  const { handleSubmit, register, reset, formState: { isSubmitting } } = useForm<FormData>()

  const openModal = () => {
    setIsOpen(true)
    setIsPrivate(false)
  }

  const closeModal = () => {
    reset()
    setIsOpen(false)
    setIsPrivate(false)
    setPreviewImage('')
    setImageUploaded('')
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
      
    } catch(error) {
      console.error(error)
    }
  }

  const onCreateRoom = async (formData: FormData) => {
    try {
      let photo
      const name = formData.name
      const privacy = formData.privacy
      const description = formData.description
      const password = formData.password
      const repassword = formData.repassword
      const userId = user.id

      // for creating a dynamic unique uuid slugs
      const uuidSlug = Math.random().toString(36).slice(-6)

      // send chat after creating a room
      const chatbox = `${user.name} created the room.`

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

      // check if the entered password is matched
      if (password !== repassword) {
        toast.custom((trigger) => (
          <CustomToaster
            toast={toast}
            trigger={trigger}
            type={'Error'}
            message={'Password did not matched, try again.'}
          />
        ))
        return
      }

      // calling create_room_mutation (for insert chat to the database)
      await createRoomMutation.mutateAsync({
        photo: String(photo === undefined ? '' : photo),
        name: String(name),
        privacy: String(privacy),
        description: String(description),
        password: String(password),
        uuidSlug: String(uuidSlug),
        userId: String(userId)
      }, 
      {
        onError: async (error: any) => {
          toast.custom((trigger) => (
            <CustomToaster
              toast={toast}
              trigger={trigger}
              type={'Error'}
              message={`${ error }`}
            />
          ))
        },
        onSuccess: async () => {
          // send chat after user created the room.
          await sendChatJoinMutation.mutateAsync({
            chatbox: String(chatbox),
            userId: String(user.id),
            roomSlug: String(uuidSlug)
          })
          // send last chat after user created the room
          await lastChat.mutateAsync({
            roomSlug: uuidSlug,
            lastChat: chatbox,
            lastChatType: 'JOIN',
            lastSentUserId: String(user.id),
            lastSentUserImage: String(user.image),
            lastSentUserName: String(user.name)
          })
          closeModal()
          Router.push(`/room/${uuidSlug}`)
        }
      })

    } catch(err) {
      console.error(err)
    }
  }

  return (
    <DialogBox
      title="Create Room"
      maxWidth="max-w-md"
      className="outline-none"
      isOpen={isOpen}
      openModal={openModal}
      closeModal={closeModal}
      button={<RiAddLine className="w-6 h-6 text-zinc-500 transition ease-in-out duration-200 transform hover:scale-90" />}
    >
      <form onSubmit={handleSubmit(onCreateRoom)} className="flex flex-col items-start w-full space-y-2">
        <div className="inline-flex items-start w-full space-x-2">
          <div className="flex w-full max-w-[3rem]">
            <label title="Upload Photo" htmlFor="addImage" className={isSubmitting ? 'cursor-wait' : 'cursor-pointer'}>
              {previewImage ?
                  <RoomImage src={previewImage} />
                :
                  <div className="inline-flex items-center justify-center rounded-xl object-cover w-[50px] h-[50px] bg-zinc-200 dark:bg-[#161818] transition ease-in-out duration-200 hover:bg-black hover:bg-opacity-30 dark:hover:bg-white dark:hover:bg-opacity-20">
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
              disabled={isSubmitting}
            />
          </div>
          <div className="flex flex-col items-end w-full space-y-2">
            <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-800 dark:text-tomato-light bg-white dark:bg-tomato-dark-secondary border border-zinc-300 dark:border-transparent focus-within:border-tomato-orange dark:focus-within:border-tomato-orange">
              <input
                type="text"
                className="w-full outline-none bg-transparent text-sm"
                placeholder="Name"
                {...register('name', { required: true })}
              />
              <RiText className="w-4 h-4" />
            </span>
            <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-800 dark:text-tomato-light bg-white dark:bg-tomato-dark-secondary border border-zinc-300 dark:border-transparent focus-within:border-tomato-orange dark:focus-within:border-tomato-orange">
              <select
                className="w-full outline-none bg-white dark:bg-tomato-dark-secondary text-sm cursor-pointer"
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
          <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-800 dark:text-tomato-light bg-white dark:bg-tomato-dark-secondary border border-zinc-300 dark:border-transparent focus-within:border-tomato-orange dark:focus-within:border-tomato-orange">
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
                <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-800 dark:text-tomato-light bg-white dark:bg-tomato-dark-secondary border border-zinc-300 dark:border-transparent focus-within:border-tomato-orange dark:focus-within:border-tomato-orange">
                  <input
                    type="password"
                    className="w-full outline-none bg-transparent text-sm"
                    placeholder="Passcode"
                    {...register('password', { required: true })}
                  />
                  <RiKey2Line className="w-4 h-4" />
                </span>
                <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-800 dark:text-tomato-light bg-white dark:bg-tomato-dark-secondary border border-zinc-300 dark:border-transparent focus-within:border-tomato-orange dark:focus-within:border-tomato-orange">
                  <input
                    type="password"
                    className="w-full outline-none bg-transparent text-sm"
                    placeholder="Re-type Passcode"
                    {...register('repassword', { required: true })}
                  />
                  <RiKey2Line className="w-4 h-4" />
                </span>
              </React.Fragment>
            )}
            <div className="inline-flex w-full space-x-2">
              {!isSubmitting && (
                <button
                  title="Create"
                  type="submit"
                  className="outline-none w-full p-2 rounded-md text-sm text-white bg-tomato-orange transition ease-in-out duration-200 hover:bg-opacity-80"
                >
                  Create
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
          <div className="inline-flex-wull">
            <p className="font-light text-[11px]">
              Note: If there is a problem with your internet connection,
              the room avatar may not be uploaded to our cloud but your room server will be automatically created.
            </p>
          </div>
        </div>
      </form>
    </DialogBox>
  )
}

export default CreateRoom