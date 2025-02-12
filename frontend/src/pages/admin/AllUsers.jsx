// import React, { useState,useEffect } from 'react'
// import Header from '../../components/Header'
// import Footer from '../../components/Footer'
// import { FaHome } from "react-icons/fa";
// import { useNavigate } from 'react-router-dom';
// import { userInstance } from '../../../middleware/AxiosInterceptor';

// export default function AllUsers() {
//   const navigate = useNavigate()
//   const [allusers,setAllUsers]=useState([])
//   const getUsers = async() =>{
//     try {
//       const res = await userInstance.post('http://localhost:8000/user/getAllUser',{
//   });
//       console.log(res.data.success)
//       if(res.data.success)
//       {
//         setAllUsers((res.data.data))
//         console.log("allusers",allusers)
//       }
//   }
//   catch(err){
//     console.log(err)
//   }
// }
//   useEffect(() => {
//     getUsers()
//   }, [])
//   return (    
//     <>
//     <Header redirect={{ path: "Logout" }}></Header>
//     <div className='min-h-screen bg-purple-200'>
//     <FaHome size={50} className='p-2 ' onClick={()=>{navigate('/home')}}/>
//     {allusers.length===0 &&
//     (<div class="bg-amber-100 rounded-lg m-4 h-12">No user present</div>)}
//     {allusers.length!==0 &&
//     (<div class="bg-amber-100 rounded-lg m-4 h-12">No user present</div>)}
//     <Footer></Footer>
//     </>
//   )
// }
