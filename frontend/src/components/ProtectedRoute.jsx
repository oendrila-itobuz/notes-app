import React, { useEffect } from 'react'
import { GlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

export default function ProtectedRoute({children}) {
  const navigate = useNavigate()
  useEffect(() => {
    const loginStatus = localStorage.getItem("loginStatus");
    if (loginStatus !== "true") {
      navigate("/login");
    }
  }, [navigate]);
  return children;  
}
