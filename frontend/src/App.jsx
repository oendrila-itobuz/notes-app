import React from 'react';
import './App.css'
import Header from './components/Header.jsx'
import Cover from './pages/Cover.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx'
import Verify from './pages/verify.jsx';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Cover />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/home' element={<Home />} />
          <Route path='/user/verify/:token' element={<Verify/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;