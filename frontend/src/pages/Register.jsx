import React, { useState } from "react";
import axios from "axios";
import Cover from "./Cover.jsx";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [backendErrorMessage, setBackendErrorMessage] = useState("");
  const { register, handleSubmit,formState } = useForm({
    resolver: yupResolver(userSchema),
  });
  const onError = (errors, e) => console.log(errors, e);
  const onSubmit = async (data, e) => {
    try {
      const res = await axios.post("http://localhost:8000/user/register", data);
      console.log(res.data.message )
      if (res.data.success) {
        setSuccessMessage("Registration successful! Please check your email for the verification link.");
        // console.log(res.data.message )
        // setTimeout(() => {
        //   navigate("/login");
        // }, 3000);
      } else {
        setBackendErrorMessage( res.data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
        setBackendErrorMessage(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <p className="text-xs text-green-600 font-semibold h-6 bg-purple-100 text-center">
        {successMessage}
      </p>
      <p className="text-xs text-red-600 font-semibold h-6 bg-purple-100 text-center">
        {backendErrorMessage}
      </p>
      <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0 bg-purple-100">
        <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
          <div className="hidden lg:block lg:w-1/2 bg-cover object-contain self-center p-5">
            <Cover />
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
                className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
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
                className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
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
              <input
                className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700 mt-2"
                type="password"
                {...register("password")}
                required
              />
              <p className="text-xs text-red-600 font-semibold h-6">
                {formState.errors.password?.message}
              </p>
            </div>
            <div className="mt-8">
              <button className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600">
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Register;
