import React from 'react'
import coverImage from '../assets/images/coverImage.jpg'
import Footer from '../components/Footer'
import Header from './../components/Header'

function Cover() {
  return (
    <>
    <div className='min-h-screen flex flex-col'>
    <Header redirect={{path:"Login"}}></Header>
    <div className="flex-grow relative overflow-hidden">
    <img src={coverImage} className="absolute inset-0 w-full h-full object-cover"></img>
    </div>
    <Footer></Footer>
    </div>
    </>
  )
}

export default Cover


