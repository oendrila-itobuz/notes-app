import React, { useState, useEffect } from "react";
import { IoChatbubbleEllipsesOutline, IoSend } from "react-icons/io5";
import { userInstance } from "../../../middleware/AxiosInterceptor";
import axios from "axios";

export default function Chat({ user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

 
  const getUser = async () => {
    try {
      const res = await userInstance.get("http://localhost:8000/user/getUser");
      if (res.data.success) {
        setAdminId(res.data.data._id);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

 
  const toggleModal = async () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      try {
        const res = await axios.post("http://localhost:8000/chat/getChat", {
          senderId: user._id,
          receiverId: adminId,
        });
        if (res.data.success) {
          setMessages(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching chat:", error.message);
      }
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      senderId: adminId,
      receiverId: user._id,
      message: messageInput.trim(),
    };

    try {
      const res = await axios.post("http://localhost:8000/chat/sendChat", newMessage);
      if (res.data.success) {
        setMessages([...messages, { userId_Sender: adminId, message: messageInput }]);
        setMessageInput(""); 
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
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
              <h3 className="text-lg font-semibold">Chat with {user.userName}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-xl font-bold">
                X
              </button>
            </div>
            
            <div className="flex-grow p-4 overflow-y-auto space-y-3 max-h-[350px]">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg max-w-[70%] ${
                    msg.userId_Sender !== user._id ? "bg-green-100 self-end text-right" : "bg-blue-100 self-start text-left"
                  }`}
                >
                  {msg.message}
                </div>
              ))}
            </div>

            <div className="p-4 border-t flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full p-2 border rounded-lg"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button 
                className="p-2 bg-blue-500 text-white rounded-full"
                onClick={sendMessage}
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
