import React from 'react'
import Cover from './Cover.jsx';
import {useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import axios from 'axios'


const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
  });
  const onError = (errors, e) => console.log(errors, e);
  const onSubmit = async (data, e) => {
    try {
      console.log(data)
      const res = await axios.post("http://localhost:8000/user/login", data);
      console.log("hii")
      if (res.data.success) {
        console.log(res.data);
        if (res.data.success === true) {
          navigate("/home");
        }
        e.target.reset();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister=()=>{
    navigate("/register")
  }
  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
    <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0 bg-purple-100">
      <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
        <div
          className="hidden lg:block lg:w-1/2 bg-cover object-contain self-center p-5"        
        > <Cover></Cover> </div>
        <div className="w-full p-8 lg:w-1/2 bg-sky-100">
          <p className="text-xl text-gray-600 text-center">Welcome To Our Notes App !</p>
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
              type="email"
              name="email"
              {...register("email")}
              required
              
            />
          </div>
          <div className="mt-4 flex flex-col justify-between">
            <div className="flex justify-between">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
            </div>
            <input
              className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
              type="password"
              {...register("password")}
              required
            />
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-gray-900 text-end w-full mt-2"
            >
              Forget Password?
            </a>
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
              <span className="text-blue-700" > Sign Up</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    </form>
  );
};

export default Login
