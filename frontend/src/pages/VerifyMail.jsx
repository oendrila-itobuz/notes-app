import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import coverImage from '../assets/images/coverImage.jpg'

const userSchema = yup.object({
  email: yup.string().email("The email is not a valid one").required(),
});

export default function VerifyMail() {
  const { register, handleSubmit,formState } = useForm({
    resolver: yupResolver(userSchema),
  });
    const onSubmit = async (data,e) => {
      try {
        const res = await axios.post("http://localhost:8000/user/resendMail", data);
        if (res.data.success) {
          toast.success("Mail Sent! Please check your email for the verification link.")
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          toast.error(res.data.message || "Login failed. Please try again.");
        }
      } catch (error) {
        toast.error(error.response?.data?.message);
    }
    };
     
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
          <div className="mt-4">
              <button className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600">
                Resend Mail
              </button>
            </div>
        </div>
      </div>
    </div>
    </div>
  </form>
  <Footer></Footer>
  <ToastContainer></ToastContainer>
  </>
  )}
