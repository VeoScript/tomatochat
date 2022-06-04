import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { MdClose } from 'react-icons/md'
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
        {post.stories.map((story: { imageUrl: string }, i: number) => (
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
      title={post.name}
      subtitle={post.description}
      maxWidth="max-w-xl"
      className="w-full outline-none"
      isLink={true}
      linkValue={post.id}
      isOpen={isOpen}
      openModal={openModal}
      closeModal={closeModal}
      button={
        <img
          key={story.imageUrl}
          src={story.imageUrl}
          alt={`Story by ${ post.username }`}
          className="object-cover w-full h-[20rem]"
        />
      }
    >
      <div className="flex flex-col w-full h-full max-h-[30rem] overflow-y-scroll scroll-smooth scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
        <img
          key={story.imageUrl}
          src={story.imageUrl}
          alt={`Story by ${ post.username }`}
          className="flex object-cover rounded-md"
        />
      </div>
    </DialogBox>
  )
}

export default PhotoSwiper