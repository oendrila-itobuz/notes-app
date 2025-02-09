import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import Header from './../components/Header'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Modal } from "flowbite-react";
import AddNote from '../components/AddNote';
import { useContext } from 'react'
import { NoteContext } from '../context/NoteContext';
import { MdDelete } from "react-icons/md";
import { GrFormView } from "react-icons/gr";
import { GrEdit } from "react-icons/gr";
import DeleteNote from '../components/DeleteNote';
import EditNote from '../components/EditNote';
import ViewNote from '../components/ViewNote';
import Footer from '../components/Footer'



export default function Home() {
  const accessToken = localStorage.getItem("accessToken");
  const [user, setUser] = useState("")
  const [message, setmessage] = useState("")
  const { register, handleSubmit, formState } = useForm({});
  const { notes, setNotes } = useContext(NoteContext)
  const { noteId, setNoteId } = useContext(NoteContext)
  const { Selectednote, setSelectedNote } = useContext(NoteContext)
  const [openModal, setOpenModal] = useState(true);
  console.log(notes)
  const fetchNotes = async (data, e) => {
    try {
      const res = await axios.get("http://localhost:8000/note/getNotes", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.data.success) {
        // setNotes(data)
        setNotes(res.data.data)
        setUser(res.data.user)

        console.log(notes)
        // console.log(res.data.data[0][0].Title)
      }
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    fetchNotes()
  }, [])

  const searchNotes = async (data, e) => {
    console.log("data", data)
    try {
      console.log("hii")
      const res = await axios.post("http://localhost:8000/note/filterNote", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.data.success) {
        console.log("hii")
        setNotes(res.data.data)
        setmessage("")
      }
      else {
        setNotes([])
        setmessage("No notes found")
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  const handleNoteClick = (noteId) => {
    setNoteId(noteId); 
    const note = notes.find(note => note._id === noteId);
    setSelectedNote(note);
  }

  return (
    <>
      <Header redirect={{ path: "Logout" }}></Header>
      <div className='min-h-screen bg-purple-200'>
      <div className="text-4xl font-serif p-2">Welcome, {user}</div>
      <form className="max-w-md mx-auto mt-5 b" onSubmit={handleSubmit(searchNotes)}>
        <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input type="search" name="title" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter The Note " {...register("title")} />
          <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Search</button>
        </div>
      </form>
      <AddNote></AddNote>
      <div className="mx-auto container py-20 px-6">
      {notes.length === 0 && (
      <p className="mt-4 text-center text-2xl font-serif">No notes present</p>)}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {notes.map((note, i) => {
            return <div key={i} onClick={()=>handleNoteClick(note._id)}>
              <div className="rounded">
                <div className="w-full h-64 flex flex-col justify-between  bg-white  rounded-lg border border-gray-400 mb-6 py-5 px-4">
                  <div>
                    <h4 className="text-gray-800 font-bold mb-3">{note.title}</h4>
                    <p className="text-gray-800 text-sm overflow-scroll scrollbar-hide">{note.description}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-gray-800">
                      <p className="text-sm">{new Date(note.updatedAt).toLocaleDateString()}</p>
                      <div className='flex gap-3'>
                        <ViewNote></ViewNote>
                        <EditNote ></EditNote>
                        <DeleteNote ></DeleteNote>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          })}
        </div>
      </div>
      <div className="text-6xl text-center">{message}</div>
      </div>
      <Footer></Footer>
    </>
  )
}