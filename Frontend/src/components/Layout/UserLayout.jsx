import React, { useEffect } from 'react'
import Header from '../Common/Header'
import Footer from '../Common/Footer'
import { Outlet, useLocation } from 'react-router-dom'

const UserLayout = () => {
  const location = useLocation()

  useEffect(()=>{
    window.scrollTo(0,0)
  },[location])
  return (
    <>
    <Header/>
    <main>
      <Outlet/>
    </main>
    <Footer/>
    </>
  )
}

export default UserLayout