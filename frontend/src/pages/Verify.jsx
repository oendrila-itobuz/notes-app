import React, { useEffect, useState } from "react"
import { useParams,useNavigate } from 'react-router-dom'
import axios from "axios";

const Verify = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const params = useParams()
  const verifyToken = params.token

  const Verification = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/user/verify`, {
        headers: {
          Authorization: `Bearer ${verifyToken}`,
        },
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.log(err)
    }
  };
    useEffect(() => {
      Verification()
    }, []) 

  return (
    <div className="flex items-center justify-center h-screen bg-pink-100">
      <div className="bg-white p-6 rounded shadow-md text-center">
      {message}   
      </div>
    </div>
  );
};

export default Verify;
