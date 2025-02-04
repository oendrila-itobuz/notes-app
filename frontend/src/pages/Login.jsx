import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const loginSchema = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:8000/user/login", data);
      if (res.data.success) {
        localStorage.setItem("accessToken", res.data.accessToken); 
        localStorage.setItem("refreshToken", res.data.refreshToken); 
        navigate("/home"); 
      } else {
        setErrorMessage(res.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || "Server error. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center justify-center h-screen w-full px-5 sm:px-0 bg-gray-100">
      <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
        <div className="w-full p-8 lg:w-1/2 bg-sky-100">
          <p className="text-xl text-gray-600 text-center">Welcome Back!</p>
          {errorMessage && <p className="text-xs text-red-600 font-semibold h-6 bg-red-100">{errorMessage}</p>}

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
        </div>
      </div>
    </form>
  );
};

export default Login;
