import React,{useContext} from 'react'
import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { userInstance } from '../../../middleware/AxiosInterceptor';
import { GlobalContext } from '../../context/GlobalContext';


export default function DeleteNote(userId) {
  const [openModal, setOpenModal] = useState(false);
  const { triggeredEvent ,setTriggeredEvent} = useContext(GlobalContext)
 const deleteUser=async()=>{
  console.log("hello")
  console.log(userId)
  setOpenModal(false)
  try{
   const res= await userInstance.post('http://localhost:8000/user/deleteUser',userId)
   if(res.data.success)
   {
    console.log("clicked")
    setTriggeredEvent(true)
   }
  }
  catch(error){
    console.log(error.response?.data?.message)
  }
 }
  return (
    <>
      <MdDelete size={38} onClick={() => setOpenModal(true)}></MdDelete>
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={deleteUser}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
