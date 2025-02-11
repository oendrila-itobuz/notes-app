import React, { useContext, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import coverImage from '../assets/images/coverImage.jpg'
import { ToastContainer, toast } from 'react-toastify';
import { NoteContext } from "../context/NoteContext.jsx";


const loginSchema = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const { loggedIn,setLoggedIn } = useContext(NoteContext);

  const onSubmit = async (data,e) => {
    try {
      const res = await axios.post("http://localhost:8000/user/login", data);
      console.log(res)
      console.log("loginstatus" ,setLoggedIn)
      if (res.data.success) {
        localStorage.setItem("accessToken", res.data.accessToken); 
        localStorage.setItem("refreshToken", res.data.refreshToken); 
        setLoggedIn("true")
        console.log("loginstatus" ,loggedIn)
        localStorage.setItem("loginStatus",loggedIn)
        navigate("/home"); 
      } else {
        toast.error(res.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      toast.error("Unauthorized access detected, verify your credentials");
  }
  };
   
  const handleRegister = () =>{
    navigate('/register')
  }

  return (
    <>
    <Header redirect={{path:"Login"}}></Header>
    <form onSubmit={handleSubmit(onSubmit)}>
    <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0 bg-purple-200">
      <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
        <div className="hidden lg:block lg:w-1/2 bg-cover object-contain self-center p-5">
           <img src={coverImage}></img>
        </div>
        <div className="w-full p-8 lg:w-1/2 bg-sky-100">
          <p className="text-xl text-gray-600 text-center">Welcome Back!</p>
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
            <input
              className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
              type="email"
              {...register("email")}
              required
            />
            <p className="text-xs text-red-600 font-semibold h-6">{formState.errors.email?.message}</p>

            <label className="text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700 mt-2"
              type="password"
              {...register("password")}
              required
            />
            <p className="text-xs text-red-600 font-semibold h-6">{formState.errors.password?.message}</p>
          </div>

          <div className="mt-8">
            <button className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600">
              Login
            </button>
          </div>
          <a
            href="#"
            className=" flex items-center justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100"
          >
           
          </a>
          <div className="mt-4 flex items-center w-full text-center">
            <a
              href="#"
              className="text-xs text-gray-500 capitalize text-center w-full"
            >
              Don&apos;t have any account yet?
              <span className="text-blue-700" onClick={handleRegister} > Sign Up</span>
            </a>
          </div>
        </div>
      </div>
      </div>
    </form>
    <Footer></Footer>
    <ToastContainer></ToastContainer>
    </>
  );
};

export default Login;
