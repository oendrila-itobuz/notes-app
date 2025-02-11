import React from 'react'
import { MdFileUpload } from "react-icons/md";
import { Button, Modal, ModalBody } from "flowbite-react";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NoteContext } from '../context/NoteContext';
import { useContext } from 'react';
import axios from 'axios';

export default function FileUpload() {
  const [openModal, setOpenModal] = useState(false);
  const openEditModal = async () => {
    setOpenModal(true);
  };
  const accessToken = localStorage.getItem("accessToken");
  const [filepresent, setfilepresent]=useState(false)
  const { Selectednote, setSelectedNote } = useContext(NoteContext)
  const onFileChange = async(event)=>{
    console.log(Selectednote._id)
    console.log(event.target.files[0].name)
    try{
      const data = new FormData()
      data.append('image', (event.target.files[0]));
      
      console.log("data",data)
      const res = await axios.post(`http://localhost:8000/note/uploadFile/${Selectednote._id}`,data,{
        headers:{
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      })

     if(res.data.success){
      setfilepresent(true)
     }

    }   
    catch(error) {
     console.log(error)
    }
  }
  return (
    <>
      <MdFileUpload size={35} onClick={openEditModal} />
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
       <Modal.Header>Upload Your File</Modal.Header>
       <Modal.Body>
                    <div className="grid grid-cols-1 space-y-2">
                                    <label className="text-sm font-bold text-gray-500 tracking-wide">Attach Document</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
                              {(Selectednote.file==="") &&
                             <div className="h-full w-full text-center flex flex-col items-center justify-center items-center  ">
                             <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-blue-400 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                             </svg>
                             <div className="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                             <img className="has-mask h-36 object-center" src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg" alt="freepik image"/>
                             </div>
                             <p className="pointer-none text-gray-500 "><span className="text-sm">Drag and drop</span> files here</p>
                             <input type="file" className="hidden" name="file" accept="image/png, image/jpeg" onChange={onFileChange}  
                             />
                         </div> }
                          
                          {<img src={Selectednote.file} className='w-20'></img>}                          
                            </label>
                        </div>
                    </div>
                            <p className="text-sm text-gray-300">
                                <span>File type: doc,pdf,types of images</span>
                            </p>
                      </Modal.Body>
                    <Modal.Footer className='justify-content-center'> 
                        <button type="submit" className="my-5 w-full bg-blue-500 text-gray-100 p-4  rounded-full 
                                    font-semibold  focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300" onClose={() => setOpenModal(false)}>
                        Upload
                    </button>
                  </Modal.Footer>
    </Modal>
    </>
  )
}
