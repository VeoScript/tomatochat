import React from 'react'
import Image from 'next/image'
import Spinner from '../../utils/Spinner'

interface IProps {
  src: string
}

const imageLoader = () => {
  return <Spinner width={0} height={0} color={''} />
}

const RoomImage: React.FC<IProps> = ({ src }) => {
  return (
    <Image
      src={src}
      blurDataURL={src}
      placeholder="blur"
      width={50}
      height={50}
      className="rounded-xl object-cover bg-white dark:bg-[#161818]"
      layout="intrinsic"
      quality={100}
      alt="Room"
    />
  )
}

export default RoomImage