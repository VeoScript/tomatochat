import React from "react"
import { useRouter } from 'next/router'

interface IProps {
  children: any
}
 
const ScrollToTop: React.FC<IProps> = ({ children }) => {
  const { pathname } = useRouter()
 
  React.useEffect(() => {
    if (pathname === "/profile/[id]") window.scrollTo(0, 0)
    console.log(pathname)
  }, [pathname])
 
  return children
}
 
export default ScrollToTop