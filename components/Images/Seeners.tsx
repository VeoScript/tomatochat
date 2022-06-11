import React from 'react'
import Image from 'next/image'

interface IProps {
  src: string
}

const Seeners: React.FC<IProps> = ({ src }) => {
  return (
    <Image
      src={src}
      width={17}
      height={17}
      className="flex max-w-[2.5rem] h-full max-h-[3rem] rounded-full object-cover bg-white dark:bg-[#161818]"
      layout="intrinsic"
      quality={100}
      alt="Profile"
    />
  )
}

export default Seeners