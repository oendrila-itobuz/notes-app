import React from 'react'
import logo from '../assets/images/logo.svg'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

export default function Header({redirect}) {
const navigate = useNavigate();

const handlechange = async()=>{
  navigate(`/login`)
  console.log(redirect)
  if (redirect.path==='logout')
  {
    const accessToken = localStorage.getItem("accessToken");
    try {
      console.log("hii")
      const res = await axios.get("http://localhost:8000/user/logout",{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });}
      catch(error){
      console.log (error.message)
      }
  }
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

