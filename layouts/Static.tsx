import React from 'react'
import { Toaster } from 'react-hot-toast'

interface IProps {
  children: any
}

const StaticLayout: React.FC<IProps> = ({ children }) => {
  return (
    <main className="font-poppins inline-flex items-center justify-center w-full h-screen overflow-hidden bg-zinc-100 dark:bg-gradient-to-br dark:from-[#1B1325] dark:via-[#12111B] dark:to-[#18132A]">
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
      <div className="flex flex-col items-center justify-center w-full h-full overflow-y-scroll scroll-smooth">
        <div className="flex flex-col items-center justify-center w-full max-w-3xl p-10 space-y-5 rounded-2xl border-0 md:border md:border-zinc-300 md:dark:border-purple-900">
          <div className="flex flex-col items-center w-full space-y-2 text-center">
            <h1 className="font-rubikglitch text-5xl text-tomato-lavender dark:text-white select-none lowercase">tomatochat</h1>
            <h3 className="font-light text-sm text-zinc-800 dark:text-zinc-400">Welcome to <span className="font-bold">Purple Tomato Club</span>. <br /> Start your convo, only with texts and emoji.</h3>
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