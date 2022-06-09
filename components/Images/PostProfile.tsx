import React from 'react'
import Image from 'next/image'

interface IProps {
  src: string
}

const PostProfile: React.FC<IProps> = ({ src }) => {
  return (
    <Image
      src={src}
      width={50}
      height={50}
      className="rounded-full object-cover bg-white dark:bg-[#201A2C]"
      layout="intrinsic"
      quality={100}
      alt="Profile"
      blurDataURL={src}
      placeholder="blur"
    />
  )
}

export default PostProfile