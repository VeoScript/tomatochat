import React from 'react'
import Image from 'next/image'

interface IProps {
  src: string
}

const MemberImage: React.FC<IProps> = ({ src }) => {
  return (
    <Image
      src={src}
      width={50}
      height={50}
      className="rounded-xl object-cover bg-white dark:bg-[#161818]"
      layout="intrinsic"
      quality={100}
      alt="Room"
      blurDataURL={src}
      placeholder="blur"
    />
  )
}

export default MemberImage