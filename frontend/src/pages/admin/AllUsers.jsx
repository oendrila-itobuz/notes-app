import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaHome } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { userInstance } from '../../../middleware/AxiosInterceptor';
import Chat from '../../components/AdminChatSystem/Chat';

export default function AllUsers() {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);

  const getUsers = async () => {
    try {
      const res = await userInstance.post('http://localhost:8000/user/getAllUser');
      if (res.data.success) {
        setAllUsers(res.data.data);
        console.log("Fetched Users:", res.data.data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <Header redirect={{ path: "Logout" }} />
      <div className="min-h-screen bg-purple-200 p-4">
        <FaHome size={50} className="p-2 cursor-pointer" onClick={() => navigate('/home')} />

        {allUsers.length === 0 ? (
          <div className="bg-amber-100 rounded-lg m-4 p-3 text-center">No users present</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-4 m-4">
            <h2 className="text-xl font-semibold mb-2 font-serif">All Users</h2>
            <ul>
              {allUsers.map((user, index) => (
                 <div className='flex items-center justify-between'>
                <li key={index} className="p-2 text-xl font-serif">{index+1}<span>. </span>{user.userName}</li>
                 <Chat></Chat>
                </div>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
