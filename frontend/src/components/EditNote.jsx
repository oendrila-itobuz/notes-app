import React, { useState, useContext, useEffect } from 'react';
import { Button, Modal } from "flowbite-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { GlobalContext } from '../context/GlobalContext';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { GrEdit } from "react-icons/gr";
import { notesInstance } from '../../middleware/AxiosInterceptor';

export const noteSchema = yup.object({
  title: yup.string().trim()
    .min(5, 'Title must be at least 5 characters')
    .max(20, 'Title must be at most 20 characters'),
  description: yup.string().trim()
    .min(20, 'Description must be at least 20 characters')
});

export default function EditNote() {
  const [openModal, setOpenModal] = useState(false);
  const { notes, setNotes, noteId,setTriggeredEvent,Selectednote } = useContext(GlobalContext);
  const [backendErrorMessage, setBackendErrorMessage] = useState("");

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(noteSchema),
  });
  setValue("title", Selectednote.title);
  setValue("description", Selectednote.description);

  const openEditModal = async () => {
    setOpenModal(true);
  };


  const editNote = async (data) => {
    try {
      const res = await notesInstance.put(
        `http://localhost:8000/note/update/${noteId}`,
        data,
      );

      if (res.data.success) {

        const updatedNotes = notes.map(note =>
          note._id === noteId ? { ...note, title: data.title, description: data.description } : note
        );

        setNotes(updatedNotes);
        setOpenModal(false);
        setTriggeredEvent(true)
      } else {
        setBackendErrorMessage(res.data.message);
      }
    } catch (error) {
      setBackendErrorMessage(error.response?.data?.message);
      console.log(error.message);
    }
  };

  return (
    <>
      <GrEdit size={30} className='cursor-pointer' onClick={openEditModal} />
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Edit Your Note</Modal.Header>
        <p className="text-xs text-red-600 font-semibold h-6">{backendErrorMessage}</p>

        <Modal.Body>
          <form>
            <div className="p-6 bg-white rounded-lg max-w-md mx-auto">
              <label className="block mb-2">Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                {...register("title")}
              />
              <p className="text-xs text-red-600 font-semibold h-6">
                {errors.title?.message}
              </p>

              <label className="block mt-4 mb-2">Description</label>
              <textarea
                className="w-full p-2 border rounded"
                rows={5}
                {...register("description")}
              ></textarea>
              <p className="text-xs text-red-600 font-semibold h-6">
                {errors.description?.message}
              </p>
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button type="submit" onClick={handleSubmit(editNote)}>Update Note</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
