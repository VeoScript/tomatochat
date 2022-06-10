import { Fragment, useState } from 'react'
import Image from 'next/image'
import DialogBox from './Modals/DialogBox'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

interface IProps {
  post: any
}

interface ViewStoryProps {
  post: any
  story: any
}

const PhotoSwiper: React.FC<IProps> = ({ post }) => {  
  return (
    <Fragment>
      <Swiper className="w-full h-full max-h-[20rem] overflow-auto rounded-xl">
        {post.stories.map((story: any, i: number) => (
          <SwiperSlide key={i}>
            <PhotoDisplay 
              post={post} 
              story={story} 
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Fragment>
  )
}

const PhotoDisplay: React.FC<ViewStoryProps> = ({ post, story }) => {
  let [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <DialogBox
      title={post.user.name}
      subtitle={post.description}
      maxWidth="max-w-xl"
      className="w-full outline-none"
      isLink={true}
      linkValue={post.id}
      isOpen={isOpen}
      openModal={openModal}
      closeModal={closeModal}
      button={
        <Image
          key={story.image}
          src={story.image}
          blurDataURL={story.image}
          className="flex object-cover rounded-md"
          layout="responsive"
          width="100%"
          height="100%"
          quality={100}
          objectFit='cover'
          alt="Post Image"
        />
      }
    >
      <div className="flex flex-col w-full h-full max-h-[30rem]">
        <Image
          key={story.image}
          src={story.image}
          blurDataURL={story.image}
          className="flex object-cover rounded-md"
          layout="responsive"
          width="100%"
          height="100%"
          quality={100}
          objectFit='contain'
          alt="Post Image"
        />
      </div>
    </DialogBox>
  )
}

export default PhotoSwiper