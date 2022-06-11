import React from 'react'
import Image from 'next/image'

interface IProps {
  src: string
}

const Profile: React.FC<IProps> = ({ src }) => {
  return (
    <Image
      src={src}
      blurDataURL={src}
      placeholder="blur"
      width={25}
      height={25}
      className="flex max-w-[2.5rem] h-full max-h-[3rem] rounded-full object-cover bg-white dark:bg-[#201A2C]"
      layout="intrinsic"
      quality={100}
      alt="Profile"
    />
  )
}

export default Profile