import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function GetAllUsers() {
const navigate = useNavigate()
  const redirect=()=>{
    console.log("i am clicked")
   navigate("/allUsers")

  }
  return (
    <div>
   <button className="relative inline-flex h-10 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50" onClick={redirect}>
  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
    GET ALL USERS
  </span>
  </button>
    </div>
  )
}
