import React, { useState, useContext,useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from "flowbite-react";
import { GlobalContext } from '../context/GlobalContext';
import { FaUser } from "react-icons/fa6";
import { userInstance } from '../../middleware/AxiosInterceptor';

export default function UserDetails() {
  const accessToken = localStorage.getItem("accessToken");
  const [openModal, setOpenModal] = useState(false);
  const { user } = useContext(GlobalContext);
  const [profilePic, setProfilePic] = useState("");
 
  const getUser = async() =>{
    try {
      const res = await userInstance.get('http://localhost:8000/user/getUser',{
  });
      console.log(res)
      if(res.data.success)
      {
          setProfilePic(res.data.data.file)
      }}
      catch(error)
      {
        console.log(error)
      }
  }
  useEffect(() => {
    getUser()
  }, [])

  const handleFileUpload = async (event) => {  
    const data= new FormData();
    data.append('image', event.target.files[0]);
    try {
      const res = await userInstance.post('http://localhost:8000/user/profileUpload',data, {
        headers: { 
          'Content-Type': 'multipart/form-data' },
      });
      
      if (res.data.success) {
        setProfilePic(res.data.data.file); 
      }
    } catch (error) {
      console.error(error);
    } 
  };

  return (
    <>
      <FaUser size={35} onClick={() => setOpenModal(true)} />      
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>User Details</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col items-center">
            <label htmlFor="file-input" className="cursor-pointer">
              <img 
                className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
                src={profilePic}
                alt="Profile"
              />
            </label>
            <input 
              id="file-input" 
              type="file" 
              className="hidden" 
              onChange={handleFileUpload} 
              accept="image/*"
            />
            <p className="mt-3 text-lg font-semibold">{user}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
