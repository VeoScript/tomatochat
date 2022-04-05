import React from 'react'

interface IProps {
  children: any
}

const MainLayout: React.FC<IProps> = ({ children }) => {
  return (
    <div>
      { children }
    </div>
  )
}

export default MainLayout