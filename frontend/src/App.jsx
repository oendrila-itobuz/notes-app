import React from 'react';
import './App.css'
import Header from './components/Header.jsx'
import Cover from './pages/Cover.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx'
import Verify from './pages/Verify.jsx';
import VerifyMail from './pages/VerifyMail.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AllUsers from './pages/admin/AllUsers.jsx';
import Error from './pages/Error.jsx';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Cover />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path='/allUsers' element={<ProtectedRoute><AllUsers/></ProtectedRoute>}/>
          <Route path='/resendMail' element={<VerifyMail/>}/>
          <Route path='/user/verify/:token' element={<Verify/>}/>
          <Route path="*" element={<Error/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;