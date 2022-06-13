import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import Image from 'next/image'
import ProfileUpload from '../../components/Uploads/ProfileUpload'
import CoverUpload from '../../components/Uploads/CoverUpload'
import CreatePost from '../../components/CreatePost'
import CardPost from '../../components/Cards/CardPost'
import Spinner from '../../utils/Spinner'
import { useGetUserPosts } from '../../lib/ReactQuery'
import { useInView } from 'react-intersection-observer'
import { RiMapPin2Line, RiUserHeartLine, RiLinkedinFill, RiEmotionSadLine } from 'react-icons/ri'
import { Facebook, Instagram, Twitter, TikTok, Youtube } from '../../utils/SocialMediaIcons'

interface IProps {
  user: any
  profile: any
}

const Profile: React.FC<IProps> = ({ user, profile }) => {

  const { ref, inView } = useInView()

  const { data: userPosts, isLoading: postLoading, isError: postError, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetUserPosts(profile.id)

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, inView])

  return (
    <div className="flex flex-col items-center w-full max-w-full h-full px-5 border-x border-zinc-300 dark:border-tomato-dark-secondary overflow-x-hidden overflow-y-scroll scroll-smooth scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
      <div className="relative flex flex-col w-full max-w-full">
        <div
          className="relative flex w-full h-[18rem] rounded-b-xl bg-white dark:bg-tomato-dark-secondary bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${profile.coverImage ? profile.coverImage : null})` }}
        >
          {user.id === profile.id && (
            <CoverUpload profile={profile} />
          )}
        </div>
        <div className="absolute left-10 -bottom-28 flex w-full">
          <div className="relative flex w-full max-w-[10rem] overflow-auto">
            <Image
              src={profile.image}
              blurDataURL={profile.image}
              width={150}
              height={150}
              className="flex w-full max-w-[2.5rem] rounded-full object-cover bg-tomato-light dark:bg-tomato-dark-slight"
              layout="intrinsic"
              quality={100}
              alt="Profile"
            />
            {user.id === profile.id && (
              <ProfileUpload profile={profile} />
            )}
          </div>
          <div className="flex flex-row items-start justify-between w-full mr-10 mt-[4rem]">
            <div className="flex flex-col ml-3 space-y-2">
              <h3 className="font-bold text-2xl tracking-tight">{profile.name}</h3>
              <div className="flex flex-col">
                <h3 className="inline-flex items-center space-x-1 font-normal text-sm tracking-tight text-zinc-500 dark:text-zinc-400">
                  <RiUserHeartLine />
                  <Link href="/">
                    <a className="hover:underline"><span className="font-bold">250</span> followers</a>
                  </Link>
                  <span>&bull;</span>
                  <Link href="/">
                    <a className="hover:underline"><span className="font-bold">89</span> following</a>
                  </Link>
                </h3>
                <h3 className="inline-flex items-center space-x-1 font-normal text-sm tracking-tight text-zinc-500 dark:text-zinc-400">
                  <RiMapPin2Line />
                  <span>Philippines</span>
                </h3>
              </div>
            </div>
            <div className="flex flex-col mt-5 mr-10">
              {user.id === profile.id
                ? <button
                    title="Follow"
                    type="button"
                    className="w-[10rem] outline-none px-3 py-2 rounded-md text-sm text-white bg-tomato-orange transition ease-in-out duration-200 hover:bg-opacity-80"
                    onClick={() => {
                      Router.push('/')
                    }}
                  >
                    Edit Profile
                  </button>
                : <div className="flex flex-row items-center w-full space-x-1">
                    <button
                      title="Follow"
                      type="button"
                      className="w-[10rem] outline-none px-3 py-2 rounded-md text-sm text-white bg-tomato-orange transition ease-in-out duration-200 hover:bg-opacity-80"
                      onClick={() => {
                        Router.push('/')
                      }}
                    >
                      Follow
                    </button>
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex flex-row items-start w-full max-w-full mt-[9rem] mb-[1rem] space-x-3">
        <div className="sticky top-2 flex flex-col w-full max-w-md p-5 space-y-3 rounded-md bg-white dark:bg-tomato-dark-slight">
          <div className="flex flex-col">
            <h2 className="font-bold text-lg text-zinc-700 dark:text-tomato-orange">Intro</h2>
            <h3 className="font-normal text-sm">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tenetur accusantium in aut sapiente? Perferendis dolorem laborum iste laudantium, delectus nemo autem nobis officiis eveniet quia in possimus, deleniti sequi minima?
            </h3>
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold text-lg text-zinc-700 dark:text-tomato-orange">Hobbies</h2>
            <div className="flex space-x-1">
              <span className="px-2 py-1 rounded-full text-xs text-white cursor-default bg-tomato-orange">Pianist</span>
              <span className="px-2 py-1 rounded-full text-xs text-white cursor-default bg-tomato-orange">Coder</span>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <h2 className="font-bold text-lg text-zinc-700 dark:text-tomato-orange">Social Links</h2>
            <Link href={`https://www.facebook.com/${profile.facebook}`}>
              <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-tomato-orange" target="_blank">
                <Facebook className="w-4 h-4 fill-current text-zinc-500" />
                <span className="font-normal text-sm">
                  @facebook
                </span>
              </a>
            </Link>
            <Link href={`https://www.facebook.com/${profile.instagram}`}>
              <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-tomato-orange" target="_blank">
                <Instagram className="w-4 h-4 fill-current text-zinc-500" />
                <span className="font-normal text-sm">
                  @instagram
                </span>
              </a>
            </Link>
            <Link href={`https://www.facebook.com/${profile.linkedin}`}>
              <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-tomato-orange" target="_blank">
                <RiLinkedinFill className="w-4 h-4 fill-current text-zinc-500" />
                <span className="font-normal text-sm">
                  @linkedin
                </span>
              </a>
            </Link>
            <Link href={`https://www.facebook.com/${profile.twitter}`}>
              <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-tomato-orange" target="_blank">
                <Twitter className="w-4 h-4 fill-current text-zinc-500" />
                <span className="font-normal text-sm">
                  @twitter
                </span>
              </a>
            </Link>
            <Link href={`https://www.facebook.com/${profile.tiktok}`}>
              <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-tomato-orange" target="_blank">
                <TikTok className="w-4 h-4 fill-current text-zinc-500" />
                <span className="font-normal text-sm">
                  @tiktok
                </span>
              </a>
            </Link>
            <Link href={`https://www.facebook.com/${profile.youtube}`}>
              <a className="flex items-center space-x-2 hover:text-zinc-400 dark:hover:text-tomato-orange" target="_blank">
                <Youtube className="w-4 h-4 fill-current text-zinc-500" />
                <span className="font-normal text-sm">
                  @youtube
                </span>
              </a>
            </Link>
          </div>
        </div>
        <div className="flex flex-col w-full max-w-xl space-y-3">
          {user.id === profile.id && (
            <CreatePost
              user={user}
              profile={profile}
            />
          )}
          {postLoading && (
            <div className="flex flex-row items-center justify-center w-full py-5">
              <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
                <Spinner width={40} height={40} color={'#F16506'} />
                <h3 className="font-light text-sm">Fetching...</h3>
              </div>
            </div>
          )}
          {postError && (
            <div className="flex flex-col items-center justify-center w-full py-5 space-y-2">
              <RiEmotionSadLine className="w-14 h-14" />
              <div className="inline-flex items-center justify-center w-full space-x-1 text-xs">
                <h3 className="font-light">Failed to load, try to</h3>
                <button
                  type="button"
                  className="outline-none font-bold text-[#6b50d8] hover:underline"
                  onClick={() => refetch()}
                >
                  Reload
                </button>
              </div>
            </div>
          )}
          {!(postLoading && postError) && (
            <React.Fragment>
              {userPosts && userPosts.pages[0].posts.length === 0 && (
                <div className="inline-flex items-center justify-center w-full py-5">
                  <div className="flex flex-col items-start w-full max-w-md space-y-3">
                    <h1 className="font-black text-4xl text-zinc-800 dark:text-zinc-100">
                      {profile.name} has no posts yet.
                    </h1>
                    <h3 className="text-lg text-zinc-500">When they do, their posts will show up here.</h3>
                  </div>
                </div>
              )}
              {userPosts && userPosts.pages.map((page: any, i: number) => (
                <React.Fragment key={i}>
                  {page.posts.map((post: any, i: number) => (
                    <CardPost
                      key={i}
                      profile={profile}
                      user={user}
                      post={post}                      
                    />
                  ))}
                </React.Fragment>
              ))}
              <button
                ref={ref}
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
              >
                {isFetchingNextPage
                  ? <Spinner width={40} height={40} color={'#F16506'} />
                  : hasNextPage
                  ? 'Fetching new posts...'
                  : ''}
              </button>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile