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
      className="rounded-xl object-cover bg-[#201A2C]"
      layout="intrinsic"
      quality={100}
      alt="Room"
    />
  )
}

export default MemberImage