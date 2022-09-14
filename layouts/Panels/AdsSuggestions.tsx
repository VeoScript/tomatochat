import React from 'react'
import NavBarProfileMenu from '../../components/NavBar/NavBarProfileMenu'
import { RiAlarmWarningFill } from 'react-icons/ri'

interface IProps {
  user: any
}

const AdsSuggestions: React.FC<IProps> = ({ user }) => {
  return (
    <div className="hidden lg:flex flex-col w-full max-w-sm h-full overflow-y-auto">
      <NavBarProfileMenu user={user} />
      <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
        <RiAlarmWarningFill className="w-10 h-10 text-tomato-orange" />
        <h3 className="font-bold">Under Maintenance</h3>
      </div>
    </div>
  )
}

export default AdsSuggestions