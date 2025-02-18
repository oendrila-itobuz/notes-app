import React, { useState,useEffect} from 'react';
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoSend } from 'react-icons/io5';
import { userInstance } from '../../../middleware/AxiosInterceptor';
import axios from 'axios';

export default function Chat(user) {
  console.log(user)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminId,setAdminId]=useState("")

  const getUser = async() =>{
    try {
      const res = await userInstance.get('http://localhost:8000/user/getUser',{
  });
     console.log(res)
      if(res.data.success)
      {
          setAdminId(res.data.data._id)
      }}
      catch(error)
      {
        console.log(error)
      }
  }
  useEffect(() => {
    getUser()
  }, [])

  const toggleModal = async () => {
    setIsModalOpen(!isModalOpen);
    const data={
      senderId:user.user._id,
      receiverId:adminId,
    };
    console.log(data)
    try {
      const res = await axios.get(
        'http://localhost:8000/chat/getChat',
        { senderId:user.user._id,
          receiverId:adminId }
      );
      console.log(res)
  }
   catch(error)
   {
    console.log(error.message)
   }
   
  };

  return (
    <div>
      <IoChatbubbleEllipsesOutline 
        size={40} 
        onClick={toggleModal} 
        className="cursor-pointer" 
      />
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-96 h-[500px] flex flex-col rounded-lg shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Chat with {user.user.userName}</h3>
              <button onClick={()=>{setIsModalOpen(!isModalOpen)}} className="text-xl font-bold">X</button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-3 max-h-[300px]">
              {/* {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`p-2 rounded-lg  ${msg.sender === "user" ? "bg-blue-100 text-left" : "bg-green-100 text-right"}`}
                >
                  {msg.text}
                </div>
              ))} */}
            </div>
            <div className="p-4 border-t flex items-center space-x-2">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="w-full p-2 border rounded-lg"
              />
              <button 
                className="p-2 bg-blue-500 text-white rounded-full"
              >
                <IoSend size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
