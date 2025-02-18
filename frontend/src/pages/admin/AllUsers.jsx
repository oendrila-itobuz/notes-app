import React, { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaHome } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { userInstance } from '../../../middleware/AxiosInterceptor';
import Chat from '../../components/AdminChatSystem/Chat';
import DeleteUser from '../../components/Admin/DeleteUser';
import { GlobalContext } from '../../context/GlobalContext';
import AddNote from '../../components/Admin/AddUserNote';

export default function AllUsers() {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const { triggeredEvent, setTriggeredEvent } = useContext(GlobalContext)
  const getUsers = async () => {
    try {
      const res = await userInstance.post('http://localhost:8000/user/getAllUser');
      if (res.data.success) {
        setAllUsers(res.data.data);
        setTriggeredEvent("false")
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    getUsers();
  }, [triggeredEvent]);

  return (
    <>
      <div className="min-h-screen bg-purple-200">
        <Header redirect={{ path: "Logout" }} />
        <div className="p-4">
          <FaHome size={50} className="p-2 cursor-pointer" onClick={() => navigate('/home')} />

          {allUsers.length === 0 ? (
            <div className="bg-amber-100 rounded-lg m-4 p-3 text-center">No users present</div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-4 m-4">
              <h2 className="text-xl font-semibold mb-2 font-serif">All Users</h2>
              <ul>
                {allUsers.map((user, index) => (
                  <div className='flex flex-col sm:flex-row m-2 items-center justify-between overflow-scroll scrollbar-hide md:g-2'>
                    <li key={index} className=" p-2 text-xl font-serif w-48 text-center md:text-left">{index + 1}<span>. </span>{user.userName}</li>
                    <div className='w-96 text-lg text-center'>{user.email}</div>
                    <div className='flex gap-2'>
                      <AddNote userId={user._id}></AddNote>
                      <DeleteUser userId={user._id}></DeleteUser>
                      <Chat user={user}></Chat>
                    </div>
                  </div>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
