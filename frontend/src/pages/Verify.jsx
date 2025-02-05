import React, { useEffect, useState } from "react"
import { useParams,useNavigate } from 'react-router-dom'
import axios from "axios";

const Verify = () => {
  console.log("hii")
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const params = useParams()
  console.log(params)
  const verifyToken = params.token
  console.log(verifyToken)

  const Verification = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/user/verify`, {
        headers: {
          Authorization: `Bearer ${verifyToken}`,
        },
      });
      console.log(res)
      setMessage(res.data.message);
      console.log(res.data.message)
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.log(err)
    }
  };
  Verification()  

  return (
    <div className="flex items-center justify-center h-screen bg-pink-100">
      <div className="bg-white p-6 rounded shadow-md text-center">
      {message}   
      </div>
    </div>
  );
};

export default Verify;
