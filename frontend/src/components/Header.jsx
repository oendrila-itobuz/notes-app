import React from 'react'
import logo from '../assets/images/logo.svg'
import { Link, useNavigate } from 'react-router-dom';

export default function Header({redirect}) {
const navigate = useNavigate();

const handlechange=()=>{
  navigate(`/login`)
}

  return (
    <>
   <nav className='flex justify-between bg-blue-100 p-2 lg:p-4'>
    <img className="w-10 h-10 " src={logo} alt="logo"></img>
    <h1 className='self-center text-2xl'>Notes App</h1>
    <a className='self-center text-xl' to="#" onClick={handlechange}><pre>{redirect.path} &rarr;</pre></a>
   </nav>
    </>
  )
}

