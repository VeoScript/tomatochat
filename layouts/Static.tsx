import React from 'react'
import TomatoChatLogo from '../utils/TomatoChatLogo'
import { Toaster } from 'react-hot-toast'

interface IProps {
  children: any
}

const StaticLayout: React.FC<IProps> = ({ children }) => {
  return (
    <main className="font-poppins inline-flex items-center justify-center w-full h-screen overflow-hidden bg-tomato-light-secondary dark:bg-tomato-dark">
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
      <div className="flex flex-col items-center justify-center w-full h-full overflow-y-scroll scroll-smooth">
        <div className="flex flex-col items-center justify-center w-full max-w-3xl p-10 space-y-5 rounded-2xl border-0 md:border md:border-zinc-300 md:dark:border-tomato-orange">
          <div className="flex flex-col items-center w-full space-y-2 text-center">
            <TomatoChatLogo
              width={50}
              height={50}
              fontSize="text-5xl"
            />
            <h3 className="font-light text-sm text-zinc-800 dark:text-zinc-100">Welcome to <span className="font-bold">VEOSCRIPT's Tomato Club</span>. <br /> Start your convo, with fun and aesthetic conversations.</h3>
          </div>
          <div className="flex flex-col w-full space-y-5">
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}

export default StaticLayout