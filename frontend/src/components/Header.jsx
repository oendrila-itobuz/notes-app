import React from 'react'
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GlobalContext } from '../context/GlobalContext';
import logo from '../assets/images/logo.svg'


export default function Header({ redirect }) { //(taking login and logout as props)
  const navigate = useNavigate();

  const handlechange = async () => {
    if (redirect.path === 'Logout') {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const res = await axios.get("http://localhost:8000/user/logout", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (res.status) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          toast.success("Logged out successfully!");
          localStorage.removeItem("loginStatus")
          navigate("/login");
        }
      }
      catch (error) {
        console.log(error.message)
      }
    }
  }

  return (
    <>
      <nav className='flex justify-between bg-gray-100 p-2 lg:p-3'>
        <div className='flex gap-2'>
          <img className="w-8 h-8 " src={logo} alt="logo"></img>
          <h1 className='self-center text-xl'>WriteD</h1>
        </div>
        <Link to="/login" onClick={handlechange} className="self-center text-xl font-serif px-3 py-1 border border-gray-700 rounded-md transition-all hover:border-[#8B0000] hover:text-[#8B0000]">{redirect.path} &rarr;</Link>
      </nav>
      <hr className="border-gray-200 sm:mx-auto" />
      <ToastContainer />
    </>
  )
}



