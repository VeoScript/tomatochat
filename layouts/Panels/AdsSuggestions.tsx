import React from 'react'
import { RiAlarmWarningFill } from 'react-icons/ri'

const AdsSuggestions = () => {
  return (
    <div className="hidden lg:flex flex-col w-full max-w-xs h-full overflow-y-auto border-l border-zinc-300 dark:border-tomato-dark-secondary">
      <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
        <RiAlarmWarningFill className="w-10 h-10 text-tomato-orange" />
        <h3 className="font-bold">Under Maintenance</h3>
      </div>
    </div>
  )
}

export default AdsSuggestions