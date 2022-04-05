import React from 'react'

interface IProps {
  children: any
}

const StaticLayout: React.FC<IProps> = ({ children }) => {
  return (
    <div>
      { children }
    </div>
  )
}

export default StaticLayout