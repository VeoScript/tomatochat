import { NextPage } from 'next'
import React from 'react'
import Router from 'next/router'
import LoadingPage from '../../layouts/Loading'

const RoomIndex: NextPage = () => {
  React.useEffect(() => {
    Router.replace('/')
  }, [])
  return (
    <LoadingPage />
  )
}

export default RoomIndex