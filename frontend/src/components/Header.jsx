import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import logo from '../assets/images/logo.svg'
import { userInstance } from '../../middleware/AxiosInterceptor';


export default function Header({ redirect }) { //(taking login and logout as props)
  const navigate = useNavigate();

  const handlechange = async () => {
    if (redirect.path === 'Logout') {
      try {
        const res = await userInstance.get("http://localhost:8000/user/logout", {
        });
        if (res.status) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("loginStatus")
          localStorage.removeItem("userRole")
          toast.success("Logged out successfully!");
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
      <Toaster />
    </>
  )
}



