import React from 'react'
import { RiCheckboxCircleFill, RiInformationFill, RiAlarmWarningFill, RiCloseFill } from 'react-icons/ri'

interface IProps {
  toast: any
  trigger: any
  type: string
  message: string
}

const CustomToaster: React.FC<IProps> = ({ toast, trigger, type, message }) => {
  return (
    <div
      className={`${
        trigger.visible ? 'animate-enter' : 'animate-leave'
      } max-w-xs w-full bg-white dark:bg-[#161818] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-zinc-300 dark:ring-black dark:ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            {type === 'Success' && <RiCheckboxCircleFill className="w-10 h-10 text-green-500" />}
            {type === 'Info' && <RiInformationFill className="w-10 h-10 text-blue-500" />}
            {type === 'Warning' && <RiAlarmWarningFill className="w-10 h-10 text-orange-500" />}
            {type === 'Error' && <RiCloseFill className="w-10 h-10 text-red-600" />}
          </div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${ type === 'Success' && 'text-green-500' || type === 'Info' && 'text-blue-500' || type === 'Warning' && 'text-orange-500' || type === 'Error' && 'text-red-600' }`}>
              { type }
            </p>
            <p className="mt-1 font-light text-xs text-zinc-400">
              { message }
            </p>
          </div>
        </div>
      </div>
      {/* <div className="flex border-l border-slate-800">
        <button
          onClick={() => toast.dismiss(trigger.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div> */}
    </div>
  )
}

export default CustomToaster