import { Fragment, useState } from 'react'
import Image from 'next/image'
import DialogBox from './Modals/DialogBox'
import Comments from './Cards/Comments'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

interface IProps {
  post: any
  user: any
}

interface ViewStoryProps {
  post: any
  user: any
  story: any
}

const PhotoSwiper: React.FC<IProps> = ({ post, user }) => {  
  return (
    <Fragment>
      <Swiper className="w-full h-full max-h-[20rem] overflow-auto rounded-xl">
        {post.stories.map((story: any, i: number) => (
          <SwiperSlide key={i}>
            <PhotoDisplay 
              post={post} 
              user={user}
              story={story} 
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Fragment>
  )
}

const PhotoDisplay: React.FC<ViewStoryProps> = ({ post, user, story }) => {
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
      postDate={post.createdAt}
      profile={post.user.image}
      maxWidth="max-w-5xl"
      className="w-full outline-none"
      isLink={true}
      linkValue={post.user.id}
      isOpen={isOpen}
      openModal={openModal}
      closeModal={closeModal}
      button={
        <Image
          key={story.image}
          src={story.image}
          blurDataURL={story.image}
          placeholder="blur"
          className="flex object-cover"
          layout="responsive"
          width="100%"
          height="100%"
          quality={100}
          objectFit='cover'
          alt="Post Image"
        />
      }
    >
      <div className="flex flex-row items-start justify-center w-full h-full space-x-3">
        <div className="flex flex-col w-full h-full max-h-[30rem] rounded-md bg-zinc-100 dark:bg-tomato-dark-slight">
          <Image
            key={story.image}
            src={story.image}
            blurDataURL={story.image}
            placeholder="blur"
            className="flex object-cover rounded-md"
            layout="responsive"
            width="100%"
            height="100%"
            quality={100}
            objectFit='contain'
            alt="Post Image"
          />
        </div>
        <div className="flex w-full max-w-sm">
          <Comments
            post={post}
            user={user}
          />
        </div>
      </div>
    </DialogBox>
  )
}

export default PhotoSwiper