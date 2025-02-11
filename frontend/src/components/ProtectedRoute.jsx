import React, { useEffect } from 'react'
import { NoteContext } from '../context/NoteContext';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

export default function ProtectedRoute({children}) {
  const { loggedIn } = useContext(NoteContext);
  const navigate = useNavigate()
  useEffect(()=>{
  if(loggedIn!=="true")
  {
    navigate('/login')
  }},[loggedIn])

  return children;  
}
