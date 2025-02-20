import React, { useState, useEffect } from "react";
import { FcCustomerSupport } from "react-icons/fc";
import { userInstance } from "../../../middleware/AxiosInterceptor";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000"); 

export default function Chat() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState("");


  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await userInstance.get("http://localhost:8000/user/getUser");
        if (res.data.success) {
          setUserId(res.data.data._id);
          socket.emit("join_room", userId);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    getUser();


    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      console.log(newMessage)
    });

    return () => {
      socket.off("receiveMessage"); 
    };
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await userInstance.post("http://localhost:8000/user/getAlladmin");
      if (res.data.success) {
        setAdmins(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const fetchChat = async (admin) => {
    if (!userId) return;
    try {
      const res = await userInstance.post("http://localhost:8000/chat/getChat", {
        senderId: userId,
        receiverId: admin._id
      });
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  const handleSelectAdmin = (admin) => {
    setSelectedAdmin(admin);
    setIsDropdownOpen(false);
    fetchChat(admin);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return; 

    const message = {
      senderId: userId,
      receiverId: selectedAdmin._id,
      message: newMessage,
    };

    try {
      socket.emit("sendMessage", message);
      const res = await userInstance.post("http://localhost:8000/chat/sendChat", message);

      if (res.data.success) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { message: newMessage, userId_Sender: userId }
        ]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <div className="fixed bottom-20 left-8 flex items-center">
        <div className="self-end">
          <FcCustomerSupport
            size={45}
            className="cursor-pointer"
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              if (!isDropdownOpen) fetchAdmins();
            }}
          />
        </div>

        {isDropdownOpen && (
          <div className="ml-4 bg-white shadow-md rounded-md p-2">
            {admins.length === 0 ? (
              <p className="p-2 text-gray-500">No admins available</p>
            ) : (
              admins.map((admin) => (
                <button
                  key={admin._id}
                  className="block px-4 py-2 text-left hover:bg-gray-200 w-full"
                  onClick={() => handleSelectAdmin(admin)}
                >
                  {admin.userName}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-96 h-[500px] flex flex-col rounded-lg shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Chat with {selectedAdmin.userName}</h3>
              <button onClick={() => setSelectedAdmin(null)} className="text-xl font-bold">X</button>
            </div>

            <div className="flex-grow p-4 overflow-y-auto space-y-3 max-h-[350px]">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg max-w-[70%] ${
                    msg.userId_Sender === userId ? "bg-green-100 self-end ml-auto text-right" : "bg-blue-100 self-start text-left"
                  }`}
                >
                  {msg.message}
                </div>
              ))}
            </div>

            <div className="p-4 border-t flex">
              <input
                type="text"
                placeholder="Type a message..."
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
                className="flex-grow border p-2 rounded-lg"
              />
              <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
