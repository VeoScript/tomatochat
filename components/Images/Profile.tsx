import React from 'react'
import Image from 'next/image'

interface IProps {
  src: string
}

const Profile: React.FC<IProps> = ({ src }) => {
  return (
    <Image
      src={src}
      width={30}
      height={30}
      className="flex w-full max-w-[2.5rem] h-full max-h-[3rem] rounded-full object-cover bg-white dark:bg-[#161818]"
      layout="intrinsic"
      quality={100}
      alt="Profile"
    />
  )
}

export default Profile