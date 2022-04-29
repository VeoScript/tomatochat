import React from 'react'
import Router from 'next/router'
import DialogBox from '../DialogBox'
import CustomToaster from '../../CustomToaster'
import Spinner from '../../../utils/Spinner'
import RoomImage from '../../Images/RoomImage'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useUpdateRoomMutation, useSendChatJoinMutation, useLastChatMutation } from '../../../lib/ReactQuery'
import { RiSettingsLine, RiCameraFill , RiText, RiAlignRight, RiKey2Line, RiCloseLine } from 'react-icons/ri'

interface IProps {
  room: any
  user: any
}

interface FormData {
  name: string
  privacy: string
  description: string
  password: string
  repassword: string
}

const RoomSettings: React.FC<IProps> = ({ room, user }) => {

  const updateRoomMutation = useUpdateRoomMutation()
  const sendChatJoinMutation = useSendChatJoinMutation()
  const lastChat = useLastChatMutation()

  let [isOpen, setIsOpen] = React.useState<Boolean>(false)
  let [isChangePasscode, setIsChangePasscode] = React.useState<Boolean>(false)
  let [isPrivate, setIsPrivate] = React.useState<String>(room.privacy)

  const [previewImage, setPreviewImage] = React.useState<any>('')
  const [imageUploaded, setImageUploaded] = React.useState<any>('')

  const defaultValues = {
    name: room.name,
    privacy: room.privacy,
    description: room.description
  }

  const { handleSubmit, register, reset, formState: { isSubmitting } } = useForm<FormData>({ defaultValues })

  const openModal = () => {
    reset(defaultValues)
    setIsOpen(true)
    setIsPrivate(room.privacy)
  }

  const closeModal = () => {
    reset(defaultValues)
    setIsOpen(false)
    setIsPrivate(room.privacy)
    setIsChangePasscode(false)
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

  const onUpdateRoom = async (formData: FormData) => {
    try {
      let photo
      const name = formData.name
      const privacy = formData.privacy
      const description = formData.description
      const password = formData.password
      const repassword = formData.repassword
      const userId = user.id

      // send chat after creating a room
      const chatbox = `${user.name} updated the room.`

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
      await updateRoomMutation.mutate({
        photo: String(photo === undefined ? room.photo : photo),
        name: String(name),
        privacy: String(privacy),
        description: String(description),
        password: String(password),
        roomSlug: String(room.slug),
        userId: String(userId)
      }, 
      {
        onError(error: any) {
          toast.custom((trigger) => (
            <CustomToaster
              toast={toast}
              trigger={trigger}
              type={'Error'}
              message={`${ error }`}
            />
          ))
        },
        onSuccess() {
          // send chat after user created the room.
          sendChatJoinMutation.mutate({
            chatbox: String(chatbox),
            userId: String(user.id),
            roomSlug: String(room.slug)
          })
          // send last chat after user created the room
          lastChat.mutate({
            roomSlug: room.slug,
            lastChat: chatbox,
            lastChatType: 'JOIN',
            lastSentUserId: String(user.id),
            lastSentUserImage: String(user.image),
            lastSentUserName: String(user.name)
          })
          closeModal()
          Router.push(`/${room.slug}`)
        }
      })

    } catch(err) {
      console.error(err)
    }
  }

  return (
    <DialogBox 
      title="Settings"
      isOpen={isOpen} 
      openModal={openModal} 
      closeModal={closeModal} 
      className="outline-none flex w-full"
      maxWidth="max-w-md"
      button={
        <div className="inline-flex items-center w-full space-x-2 p-3 font-light text-xs text-left cursor-pointer transition ease-in-out duration-200 hover:bg-[#1F1E35]">
          <RiSettingsLine className="w-5 h-5 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-90" />
          <span>Settings</span>
        </div>
      } 
    >
      <form onSubmit={handleSubmit(onUpdateRoom)} className="flex flex-col items-start w-full space-y-2">
        <div className="inline-flex items-start w-full space-x-2">
          <div className="flex w-full max-w-[3rem]">
            <label title="Change Photo" htmlFor="addImage" className={isSubmitting ? 'cursor-wait' : 'cursor-pointer'}>
              {previewImage ?
                  <RoomImage src={previewImage} />
                :
                  <React.Fragment>
                    {room.photo && <RoomImage src={room.photo} />}
                    {!room.photo && (
                      <div className="inline-flex items-center justify-center rounded-xl object-cover w-[50px] h-[50px] bg-[#201A2C] transition ease-in-out duration-200 hover:bg-white hover:bg-opacity-20">
                        <RiCameraFill  />
                      </div>
                    )}
                  </React.Fragment>
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
            <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-100 bg-[#201A2C] border border-transparent focus-within:border-purple-600">
              <input
                type="text"
                className="w-full outline-none bg-transparent text-sm"
                placeholder="Change Name"
                {...register('name', { required: true })}
              />
              <RiText className="w-4 h-4" />
            </span>
            <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-100 bg-[#201A2C] border border-transparent focus-within:border-purple-600">
              <select
                className="w-full outline-none bg-[#201A2C] text-sm cursor-pointer"
                {...register('privacy', { required: true })}
                onInput={(e: any) => {
                  switch(e.currentTarget.value) {
                    case 'Private':
                      setIsPrivate('Private')
                      break
                    case 'Public': 
                      setIsPrivate('Public')
                      break
                    default:
                      setIsPrivate('Public')
                  }
                }}
              >
                <option value="" className="hidden">Change Privacy Status</option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
              <RiKey2Line className="w-4 h-4" />
            </span>
          </div>
        </div>
        <div className="block w-full space-y-2">
          <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-100 bg-[#201A2C] border border-transparent focus-within:border-purple-600">
            <input
              type="text"
              className="w-full outline-none bg-transparent text-sm"
              placeholder="Description"
              {...register('description', { required: true })}
            />
            <RiAlignRight className="w-4 h-4" />
          </span>
          <div className="flex flex-col w-full space-y-2">
            {(isPrivate === 'Private') && (
              <React.Fragment>
                {!isChangePasscode && (
                  <button
                    type="button"
                    className="outline-none w-full p-2 rounded-md text-sm bg-purple-800 transition ease-in-out duration-200 hover:bg-opacity-80"
                    onClick={() => {
                      setIsChangePasscode(true)
                    }}
                  >
                    Change Passcode
                  </button>
                )}
                <div className={isChangePasscode ? 'flex flex-col w-full space-y-2' : 'hidden'}>
                  <div className="inline-flex items-center justify-between w-full">
                    <h3 className="text-xs ml-2">Change/New Passcode</h3>
                    <button
                      title="Close"
                      type="button"
                      onClick={() => {
                        setIsChangePasscode(false)
                      }}
                    >
                      <RiCloseLine className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                  </div>
                  <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-100 bg-[#201A2C] border border-transparent focus-within:border-purple-600">
                    <input
                      type="password"
                      className="w-full outline-none bg-transparent text-sm"
                      placeholder="Passcode"
                      {...register('password', { required: room.privacy === 'Public' ? true : false })}
                    />
                    <RiKey2Line className="w-4 h-4" />
                  </span>
                  <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-100 bg-[#201A2C] border border-transparent focus-within:border-purple-600">
                    <input
                      type="password"
                      className="w-full outline-none bg-transparent text-sm"
                      placeholder="Re-type Passcode"
                      {...register('repassword', { required: room.privacy === 'Public' ? true : false })}
                    />
                    <RiKey2Line className="w-4 h-4" />
                  </span>
                </div>
              </React.Fragment>
            )}
            <div className="inline-flex w-full space-x-2">
              {!isSubmitting && (
                <button
                  type="submit"
                  className="outline-none w-full p-2 rounded-md text-sm bg-purple-800 transition ease-in-out duration-200 hover:bg-opacity-80"
                >
                  Update
                </button>
              )}
              {isSubmitting && (
                <div className="inline-flex items-center justify-center w-full space-x-2 p-2 cursor-wait rounded-md text-sm bg-purple-800 bg-opacity-80">
                  <Spinner
                    width={20}
                    height={20}
                    color={'#FFFFFF'}
                  />
                  <span className="font-light">Updating...</span>
                </div>
              )}
            </div>
          </div>
          <div className="inline-flex-wull">
            <p className="font-light text-[11px]">
              Note: If there is a problem with your internet connection,
              the room avatar may not be uploaded to our cloud but your room server will be automatically updated.
            </p>
          </div>
        </div>
      </form>
    </DialogBox>
  )
}

export default RoomSettings