import React from 'react'
import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { useContext } from 'react'
import { GlobalContext } from '../context/GlobalContext';
import { notesInstance } from '../../middleware/AxiosInterceptor';

export default function DeleteNote() {
  const [openModal, setOpenModal] = useState(false);
  const { noteId, setNoteId , notes ,setNotes,setTriggeredEvent } = useContext(GlobalContext)

  const deleteNote = async () => {
    try {
      const res = await notesInstance.delete(
        `http://localhost:8000/note/delete/${noteId}`,
      );
      if (res.data.success) {
        setNoteId("")
        setOpenModal(false);
        const updatedNotes = notes.filter(note => note._id !== noteId);
        setNotes(updatedNotes)
        setTriggeredEvent(true)
      }
      else {
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <MdDelete size={35} className='cursor-pointer' onClick={() => setOpenModal(true)}></MdDelete>
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this note?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={deleteNote}>
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
