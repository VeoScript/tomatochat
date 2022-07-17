import React, { Fragment, useState } from 'react'
import Router from 'next/router'
import Image from 'next/image'
import DialogBox from '../DialogBox'
import Comments from '../../Cards/Comments'
import { RiChat1Fill } from 'react-icons/ri'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Link from 'next/link'

interface IProps {
  post: any
  user: any
  commentDisplaySmall: boolean
}

interface ViewStoryProps {
  post: any
  user: any
  story: any
}

interface ViewTextStoriesProps {
  post: any
  user: any
  stories: any
}

interface ViewTextProps {
  post: any
  user: any
}

const ViewPost: React.FC<IProps> = ({ post, user, commentDisplaySmall }) => {
  return (
    <Fragment>
      {commentDisplaySmall === true && (
        <>
          {post.stories.length === 0
            ? <TextDisplay
                post={post} 
                user={user}
              />
            : <TextStoriesDisplay
                post={post} 
                user={user}
                stories={post.stories}
              />
          }
        </>
      )}
      {commentDisplaySmall === false && (
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
      )}
    </Fragment>
  )
}

// display all the photos in card post
const PhotoDisplay: React.FC<ViewStoryProps> = ({ post, user, story }) => {
  let [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
    if (Router.pathname === '/') Router.push(`/`, undefined, { shallow: true })
    if (Router.pathname === '/profile/[id]') return Router.push(`/profile/${post.user.id}`, undefined, { shallow: true })
  }

  function openModal() {
    if (Router.pathname === '/') Router.push(`?post=${post.id}`, `/profile/${post.user.id}/post/${post.id}`, { shallow: true })
    if (Router.pathname === '/profile/[id]') Router.push(`?post=${post.id}`, `/profile/${post.user.id}/?post=${post.id}`, { shallow: true })
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
        <div className="flex flex-col w-full h-full max-h-[30rem] rounded-xl bg-tomato-light dark:bg-tomato-dark-slight">
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
            withImage={true}
            closeModal={closeModal}
          />
        </div>
      </div>
    </DialogBox>
  )
}

// for card post comment button trigger (post description with post stories)
const TextStoriesDisplay: React.FC<ViewTextStoriesProps> = ({ post, user, stories }) => {
  let [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
    if (Router.pathname === '/') Router.push(`/`, undefined, { shallow: true })
    if (Router.pathname === '/profile/[id]') return Router.push(`/profile/${post.user.id}`, undefined, { shallow: true })
  }

  function openModal() {
    if (Router.pathname === '/') Router.push(`?post=${post.id}`, `/profile/${post.user.id}/post/${post.id}`, { shallow: true })
    if (Router.pathname === '/profile/[id]') Router.push(`?post=${post.id}`, `/profile/${post.user.id}/?post=${post.id}`, { shallow: true })
    setIsOpen(true)
  }

  return (
    <DialogBox
      title={post.user.name}
      postDate={post.createdAt}
      profile={post.user.image}
      maxWidth="max-w-5xl"
      className="w-full outline-none transition ease-in-out duration-200 transform hover:scale-90"
      isLink={true}
      linkValue={post.user.id}
      isOpen={isOpen}
      openModal={openModal}
      closeModal={closeModal}
      button={
        <span className="text-neutral-400">
          <RiChat1Fill className="w-6 h-6" />
        </span>
      }
    >
      <div className="flex flex-row items-start justify-center w-full h-full space-x-3">
        <Swiper className="relative flex flex-row items-center justify-center w-full h-full max-h-[30rem] rounded-xl bg-tomato-light dark:bg-tomato-dark-slight">
          {stories.length > 1 && (
            <>
              <span className="absolute z-10 top-3 right-3 px-3 py-1 rounded-md select-none text-xs text-white bg-black bg-opacity-50">
                {post.stories.length} Photos
              </span>
              <span className="absolute z-10 bottom-3 right-3 px-3 py-1 rounded-md select-none text-xs text-white bg-black bg-opacity-50">
                Slide to see more...
              </span>
            </>
          )}
          {stories.map((story: any, i: number) => (
            <SwiperSlide key={i}>
              <Image
                key={story.image}
                src={story.image}
                blurDataURL={story.image}
                placeholder="blur"
                className="bg-contain bg-center"
                layout="responsive"
                width="100%"
                height="100%"
                quality={100}
                objectFit='contain'
                alt="Post Image"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="flex w-full max-w-sm">
          <Comments
            post={post}
            user={user}
            withImage={true}
            closeModal={closeModal}
          />
        </div>
      </div>
    </DialogBox>
  )
}

// for card post comment button trigger (post description only)
const TextDisplay: React.FC<ViewTextProps> = ({ post, user }) => {
  let [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
    if (Router.pathname === '/') Router.push(`/`, undefined, { shallow: true })
    if (Router.pathname === '/profile/[id]') Router.push(`/profile/${post.user.id}`, undefined, { shallow: true })
  }

  function openModal() {
    if (Router.pathname === '/') Router.push(`?post=${post.id}`, `/profile/${post.user.id}/post/${post.id}`, { shallow: true })
    if (Router.pathname === '/profile/[id]') Router.push(`?post=${post.id}`, `/profile/${post.user.id}/?post=${post.id}`, { shallow: true })
    setIsOpen(true)
  }

  return (
    <DialogBox
      title={post.user.name}
      postDate={post.createdAt}
      profile={post.user.image}
      maxWidth="max-w-xl"
      className="w-full outline-none transition ease-in-out duration-200 transform hover:scale-90"
      isLink={true}
      linkValue={post.user.id}
      isOpen={isOpen}
      openModal={openModal}
      closeModal={closeModal}
      button={
        <span className="text-neutral-400">
          <RiChat1Fill className="w-6 h-6" />
        </span>
      }
    >
      <div className="flex flex-col items-start justify-center w-full h-full space-y-5">
        <p className="text-xl break-all whitespace-pre-wrap">{post.description}</p>
        <div className="flex w-full max-w-full">
          <Comments
            post={post}
            user={user}
            withImage={false}
            closeModal={closeModal}
          />
        </div>
      </div>
    </DialogBox>
  )
}

export default ViewPost