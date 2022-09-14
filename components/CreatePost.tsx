import React from 'react'
import Image from 'next/image'
import CustomToaster from './CustomToaster'
import PostUpload from '../components/Uploads/PostUpload'
import Spinner from '../utils/Spinner'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useCreatePost, useCreateStory } from '../lib/ReactQuery'
import { RiCloseFill } from 'react-icons/ri'

interface IProps {
  user: any
  profile: any
}

interface FormData {
  postcaption: string
}

const imageTypeRegex = /image\/(png|jpg|jpeg)/gm

const CreatePost: React.FC<IProps> = ({ user, profile }) => {

  const createPost = useCreatePost()
  const createStory = useCreateStory()

  const [imageFiles, setImageFiles] = React.useState<any>([])
  const [images, setImages] = React.useState<any>([])

  const { handleSubmit, register, reset, setValue, formState: { isSubmitting } } = useForm<FormData>()

  const handleAddImage = (e: any) => {
    const { files } = e.target
    const validImagesFiles = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (file.type.match(imageTypeRegex)) {
        validImagesFiles.push(file)
      } else {
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
        setImages([])
        setImageFiles([])
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
    }

    if (validImagesFiles.length > 4) {
      toast.custom((trigger) => (
        <CustomToaster
          toast={toast}
          trigger={trigger}
          type={'Info'}
          message={'Only up to 4 photos can be uploaded.'}
        />
      ))
      return
    }

    if (validImagesFiles.length) {
      setImageFiles(validImagesFiles)
      return
    }
  }

  React.useEffect(() => {
    const images: any[] = []
    const fileReaders: FileReader[] = []
    let isCancel = false

    // for post caption text input
    register('postcaption', { required: true })

    if (imageFiles.length) {
      imageFiles.forEach((file: any) => {
        const fileReader = new FileReader()
        fileReaders.push(fileReader)

        fileReader.onload = (e: any) => {
          const { result } = e.target

          if (result) {
            images.push(result)
          }

          if (images.length === imageFiles.length && !isCancel) {
            setImages(images)
          }
        }
        fileReader.readAsDataURL(file)
      })
    }

    return () => {
      isCancel = true
      fileReaders.forEach(fileReader => {
        if (fileReader.readyState === 1) {
          fileReader.abort()
        }
      })
    }
  }, [imageFiles, register])

  const onSubmitPost = async (formData: FormData) => {
    try {
      let photo = new Array
      
      // check if there is selected photo, hence it will upload it to the gallery hosting
      if (imageFiles || images) {
        const body = new FormData()

        // uploading multiple images
        for (let i = 0; i < imageFiles.length; i++) {
          body.append('image', imageFiles[i])

          await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API}`, {
            method: 'POST',
            body: body
          })
          .then((response) => response.json())
          .then((result) => {
            photo.push(result.data.url)
          })
          .catch((err) => {
            console.log(err)
            toast.custom((trigger) => (
              <CustomToaster
                toast={toast}
                trigger={trigger}
                type={'Error'}
                message={'Upload failed. Check your internet.'}
              />
            ))
            return
          })
        }
      }

      const postcaption = document.getElementById('postcaption')

      // for creating a dynamic unique post uuid
      const postId = Math.random().toString(36).slice(-8)
      const userId = user.id
      const description = formData.postcaption

      // send this post to post model
      await createPost.mutateAsync({
        description: String(description),
        postId: String(postId),
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
          // for sending all of the selected images to database
          for (let i = 0; i < photo.length; i++) {
            await createStory.mutateAsync({
              imageUrl: String(photo[i]),
              postId: String(postId)
            })
          }
          toast.custom((trigger) => (
            <CustomToaster
              toast={toast}
              trigger={trigger}
              type={'Success'}
              message="Post created successfully."
            />
          ))
        }
      })

      setImages([])
      setImageFiles([])
      reset()

      postcaption !== null ?
      postcaption.innerHTML = '' : ''
      postcaption?.focus()

    } catch(err) {
      console.error(err)
    }
  }

  const handleLineBreak = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(onSubmitPost)()
    }
  }

  return (
    <div className="flex flex-col w-full space-y-2 p-5 rounded-xl back-shadow bg-white dark:bg-tomato-dark-slight">
      <div className="flex flex-col lg:flex-row items-start w-full space-x-0 lg:space-x-2 space-y-3 lg:space-y-0">
        <div className="flex flex-row items-center space-x-2">
          <Image
            src={profile.image}
            blurDataURL={profile.image}
            width={58}
            height={58}
            className="flex w-full h-full rounded-full object-cover bg-white dark:bg-[#161818]"
            layout="intrinsic"
            quality={100}
            alt="Profile"
          />
          <h3 className="flex lg:hidden font-bold text-lg">{ user.name }</h3>
        </div>
        <div className="flex flex-row items-start w-full px-5 py-3 rounded-3xl bg-zinc-100 dark:bg-tomato-dark-secondary border border-transparent dark:border-transparent focus-within:border-transparent dark:focus-within:border-tomato-orange">
          <div
            id="postcaption"
            className="w-full h-full max-h-[15rem] mt-0.5 overflow-y-auto cursor-text whitespace-pre outline-none font-normal text-sm"
            placeholder="Share your thoughts here in tomatochat..."
            title="Shift+Enter to execute new line."
            contentEditable="true"
            suppressContentEditableWarning
            spellCheck={false}
            onPaste={(e) => {
              e.preventDefault()
              var text = e.clipboardData.getData('text/plain')
              document.execCommand('insertText', false, text)
            }}
            onKeyPress={handleLineBreak}
            onInput={(e: any) => setValue('postcaption', e.currentTarget.textContent, { shouldValidate: true })}
          />
          <PostUpload
            handleAddImage={handleAddImage}
          />
        </div>
      </div>
      <div className="flex items-center w-full">
        {images.length > 0 && (
          <div className="flex items-center justify-center w-full space-x-1">
            {images.map(( image: any, i: number ) => {
              return (
                <div className="relative" key={i}>
                  {!isSubmitting && (
                    <button
                      title="Remove"
                      type="button"
                      className="absolute top-1 right-1 z-10 p-1 rounded-full bg-black bg-opacity-80 hover:bg-opacity-50"
                      onClick={() => {
                        // for deleting specific photo
                        let previewImages = images.map((photo: any) => photo).indexOf(image)
                        let toUploadImages = imageFiles.map((photo: any) => photo.name).indexOf(image)
                        if (previewImages > -1 || toUploadImages > -1) {
                          images.splice(previewImages, 1)
                          imageFiles.splice(toUploadImages, 1)
                          setImages(images)
                          setImageFiles(imageFiles)
                        }
                      }}
                    >
                      <RiCloseFill className="w-4 h-4 text-white" />
                    </button>
                  )}
                  <Image
                    src={image}
                    blurDataURL={image}
                    width={300}
                    height={300}
                    className="rounded-md object-cover bg-white dark:bg-[#161818]"
                    layout="intrinsic"
                    quality={100}
                    alt="Post Images"
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
      <div className="inline-flex items-start justify-between w-full space-x-2">
        <div className="w-[25rem]">
          <p className="font-light text-[12px] text-neutral-400">
            Note: Be responsible with your post, any hateful or offensive posts will be automatically deleted.
          </p>
        </div>
        {!isSubmitting && (
          <button
            title="Create"
            type="button"
            className="outline-none w-[6rem] p-2 rounded-lg text-sm text-white bg-tomato-orange transition ease-in-out duration-200 hover:bg-opacity-80"
            onClick={handleSubmit(onSubmitPost)}
          >
            Post
          </button>
        )}
        {isSubmitting && (
          <div className="inline-flex items-center justify-center w-[6rem] space-x-2 p-2 cursor-wait rounded-lg text-sm text-white bg-tomato-orange bg-opacity-80">
            <Spinner
              width={20}
              height={20}
              color={'#FFFFFF'}
            />
            <span className="font-light">Posting...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreatePost