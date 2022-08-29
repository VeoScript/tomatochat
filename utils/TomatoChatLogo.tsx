import React from 'react'
import Image from 'next/image'

interface LogoProps {
  width: number
  height: number
  fontSize: string
}

const TomatoChatLogo: React.FC<LogoProps> = ({ width, height, fontSize }) => {
  return (
    <div className="inline-flex items-center space-x-2">
      <Image src="/tomatochat_svg.svg" alt="TomatoChat Logo" width={width} height={height} />
      <span className={`hidden md:inline font-rubikglitch ${fontSize} text-[#BD3207] lowercase`}>
        tomato<span className="text-tomato-orange">chat</span>
      </span>
    </div>
  )
}

export default TomatoChatLogo