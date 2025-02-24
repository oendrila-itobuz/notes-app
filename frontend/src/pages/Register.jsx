import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import coverImage from '../assets/images/coverImage.jpg'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const userSchema = yup.object({
  userName: yup
    .string()
    .trim()
    .min(5, "userName must be at least 5 characters")
    .max(20, "userName must be at most 20 characters"),
  email: yup.string().email("The email is not a valid one").required(),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must include at least one uppercase letter")
    .matches(/[a-z]/, "Must include at least one lowercase letter")
    .matches(/\d/, "Must include at least one number")
    .matches(/\W/, "Must include at least one special character"),
});

const Register = () => {
  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(userSchema),
  });
  const [toggle, settoggle] = useState(false);
  const onError = (errors, e) => console.log(errors, e);
  const onSubmit = async (data, e) => {
    try {
      const res = await axios.post("http://localhost:8000/user/register", data);
      if (res.data.success) {
        toast.success("Registration successful! Please check your email for the verification link.")
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        toast.error(res.data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An unexpected error occurred.");
    }
    reset()
  };

  return (
    <>
      <div className="min-h-screen bg-purple-200">
        <Header redirect={{ path: "Login" }}></Header>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="flex items-center justify-center w-full mt-20 md:mt-30 px-5 sm:px-0">
            <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
              <div className="hidden lg:block lg:w-1/2 bg-cover object-contain self-center p-5">
                <img src={coverImage}></img>
              </div>
              <div className="w-full p-8 lg:w-1/2 bg-sky-100">
                <p className="text-xl text-gray-600 text-center">
                  Welcome To Our Notes App!
                </p>
                <div className="mt-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    User Name
                  </label>
                  <input
                    className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full"
                    type="text"
                    {...register("userName")}
                    required
                  />
                  <p className="text-xs text-red-600 font-semibold h-6">
                    {formState.errors.userName?.message}
                  </p>

                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email Address
                  </label>
                  <input
                    className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full"
                    type="email"
                    {...register("email")}
                    required
                  />
                  <p className="text-xs text-red-600 font-semibold h-6">
                    {formState.errors.email?.message}
                  </p>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Password
                  </label>
                  {!toggle && (
                    <div className="relative">
                      <input
                        className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-none mt-2"
                        type="password"
                        {...register("password")}
                        required
                      />
                      <FaEyeSlash
                        className="absolute inset-y-3 right-2"
                        onClick={() => settoggle(true)}
                      />
                    </div>
                  )}
                  {toggle && (
                    <div className="relative">
                      <input
                        className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-none mt-2"
                        type="text"
                        {...register("password")}
                        required
                      />
                      <FaEye
                        className="absolute inset-y-3 right-2"
                        onClick={() => settoggle(false)}
                      />
                    </div>
                  )}
                  <p className="text-xs text-red-600 font-semibold h-6">
                    {formState.errors.password?.message}
                  </p>
                </div>
                <div className="mt-4">
                  <button className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600">
                    Register
                  </button>
                </div>
                <div className="mt-3 text-center">
                  <Link to={'/resendMail'} className="text-gray-700 self-center text-xs sm:text-xl font-serif px-3 py-1 border border-gray-700 rounded-md transition-all hover:border-[#8B0000] hover:text-[#8B0000]">Resend Verification link </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
        <Footer></Footer>
        <ToastContainer></ToastContainer>
      </div>
    </>
  );
};

export default Register;
