import React, { useState, useContext } from 'react';
import { Modal, Button } from "flowbite-react";
import { NoteContext } from '../context/NoteContext';
import { GrFormView } from "react-icons/gr";

export default function ViewNote() {
  const [openModal, setOpenModal] = useState(false);
  const { notes, noteId } = useContext(NoteContext);
  const { Selectednote, setSelectedNote } = useContext(NoteContext)

  // Function to Open Modal and Set Note Data


  return (
    <>
      <GrFormView size={35} onClick={()=>{setOpenModal(true)}} />
      
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>View Note</Modal.Header>
        <Modal.Body>
            <div className="p-6 bg-white rounded-lg max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">{Selectednote.title}</h3>
              <p className="text-gray-700">{Selectednote.description}</p>
              <p className="text-xs text-gray-500 mt-4">Last updated: {new Date(Selectednote.updatedAt).toLocaleDateString()}</p>
            </div>
          
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
