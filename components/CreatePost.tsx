import React from 'react'
import Image from 'next/image'
import CustomToaster from './CustomToaster'
import PostUpload from '../components/Uploads/PostUpload'
import { toast } from 'react-hot-toast'

interface IProps {
  user: any
  profile: any
}

const CreatePost: React.FC<IProps> = ({ user, profile }) => {

  const [previewImage, setPreviewImage] = React.useState<any>([])
  const [imageUploaded, setImageUploaded] = React.useState<any>([{}])

  const handleAddImage = async (e: any) => {
    try {
      const files = [...e.target.files].map(file => {
        const reader = new FileReader();
        var allowedExtensions = /(\.jpg|\.jpeg|\.jfif|\.png)$/i

        if(e.target.value !== '' && !allowedExtensions.exec(e.target.value)) {
          e.target.value = ''
          setImageUploaded([])
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
  
        if(file.size > 2097152) {
          setImageUploaded([])
          setPreviewImage([])
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

        return new Promise(resolve => {
          reader.onload = () => resolve(reader.result)
          reader.readAsDataURL(file);
        });
      });

      const res = await Promise.all(files)
      setPreviewImage(res)
      setImageUploaded(res)

    } catch(error) {
      console.error(error)
    }
  }

  console.log(previewImage)
  // console.log(imageUploaded)

  const onUploadPhotos = async () => {
    try {
      let photo

      // check if there is selected photo, hence it will upload it to the gallery hosting
      if (imageUploaded || previewImage) {
        const body = new FormData()

        for (let i = 0; i < imageUploaded.length; i++) {
          body.append('image', imageUploaded[i])
        }

        await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API}`, {
          method: 'POST',
          body: body
        })
        .then((response) => response.json())
        .then((result) => {
          console.log(result.data.url)
        })
        .catch(() => {
          console.error('Upload Failed')
        })
      }

      // await changeProfileMutation.mutateAsync({
      //   photo: String(photo),
      //   userId: String(profile.id)
      // })

      // closeModal()

    } catch(err) {
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col w-full p-3 rounded-md bg-white dark:bg-[#1F1E35]">
      <div className="flex items-start space-x-2">
        <Image
          src={profile.image}
          blurDataURL={profile.image}
          width={50}
          height={50}
          className="flex w-full max-w-[2.5rem] rounded-full object-cover bg-white dark:bg-[#201A2C]"
          layout="intrinsic"
          quality={100}
          alt="Profile"
        />
        <div className="flex flex-col w-full">
          <div
            id="contentEditable"
            className="w-full h-full max-h-[15rem] overflow-y-auto cursor-text whitespace-pre-wrap outline-none p-3 font-normal text-sm rounded-full border border-transparent focus:border-purple-600"
            placeholder="What's on your mind?"
            title="Shift+Enter to execute new line."
            contentEditable="true"
            suppressContentEditableWarning
            spellCheck={false}
          />
        </div>
        <PostUpload
          handleAddImage={handleAddImage}
        />
      </div>
      <button
        type="button"
        onClick={onUploadPhotos}
      >
        Upload
      </button>
    </div>
  )
}

export default CreatePost