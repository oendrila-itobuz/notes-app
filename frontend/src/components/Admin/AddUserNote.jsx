import React, { useEffect, useState } from 'react'
import { Button, Modal } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useContext } from 'react'
import { GlobalContext } from '../../context/GlobalContext';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { notesInstance } from '../../../middleware/AxiosInterceptor';
import { MdOutlineNoteAdd } from "react-icons/md";

const noteSchema = yup.object({

  title: yup.string().trim()
    .min(5, 'Title must be at least 8 characters')
    .max(20, 'Title must be at most 20 characters'),
  description: yup.string().trim()
    .min(20, 'Description must be at least 20 characters')
});

export default function AddNote(userId) {
  const { register, handleSubmit, formState,reset } = useForm({ resolver: yupResolver(noteSchema) });
  const [openModal, setOpenModal] = useState(false);
  const { notes, setNotes } = useContext(GlobalContext)
  const [backendErrorMessage, setBackendErrorMessage] = useState("");
  const { triggeredEvent, setTriggeredEvent } = useContext(GlobalContext)

  const addNote = async (data,e) => {
    try {
      data.userId=userId.userId
      const res = await notesInstance.post(
        "http://localhost:8000/note/addNote",
        data
      );
      if (res.data.success) {
        setNotes([...notes, res.data.data[0]]);
        setTriggeredEvent(true)
        setOpenModal(false);
        reset()
      }
      else {
        setBackendErrorMessage(res.data.message);
        console.log(error)
      }
    } catch (error) {
      setBackendErrorMessage(error?.response?.data?.message);
      console.log(backendErrorMessage)
    }
  };

  return (
    <>
      <div>
       <MdOutlineNoteAdd size={37} onClick={() => setOpenModal(true)}></MdOutlineNoteAdd>
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Your Note Details</Modal.Header>
          <p className="text-xs text-red-600 font-semibold h-6 text-center m-4">
            {backendErrorMessage}
          </p>
          <Modal.Body>
            <form>
              <div className="p-6 bg-white rounded-lg max-w-md mx-auto">

                <label className="block mb-2">Title</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  name="title"
                  {...register("title")}

                />
                <p className="text-xs text-red-600 font-semibold h-6">
                  {formState.errors.title?.message}
                </p>
                <label className="block mt-4 mb-2">Description</label>
                <textarea
                  className="w-full p-2 border rounded" rows={20}
                  name="description"
                  {...register("description")}
                ></textarea>
                <p className="text-xs text-red-600 font-semibold h-6">
                  {formState.errors.description?.message}
                </p>
              </div>
            </form>
          </Modal.Body>
          <form>
            <Modal.Footer>
              <Button type='submit' onClick={handleSubmit(addNote)}>Add Note</Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                Decline
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    </>
  )
}

