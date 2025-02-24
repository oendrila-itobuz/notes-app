import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import Header from './../components/Header'
import AddNote from '../components/AddNote';
import { useContext } from 'react'
import { GlobalContext } from '../context/GlobalContext';
import DeleteNote from '../components/DeleteNote';
import EditNote from '../components/EditNote';
import ViewNote from '../components/ViewNote';
import Footer from '../components/Footer'
import FileUpload from '../components/FileUpload';
import UserDetails from '../components/UserDetails';
import { notesInstance, userInstance } from '../../middleware/AxiosInterceptor';
import GetAllUsers from '../components/Admin/GetAllUsers';
import Chat from '../components/users/Chat';
import { FaArrowAltCircleRight } from "react-icons/fa";
import { FaArrowAltCircleLeft } from "react-icons/fa";

export default function Home() {
  const { user, setUser, notes, setNotes, noteId, setNoteId, Selectednote, setSelectedNote, totalpages, settotalpages, triggeredEvent, setTriggeredEvent } = useContext(GlobalContext)
  const [message, setmessage] = useState("")
  const { register, handleSubmit, formState } = useForm({});
  const [sortBy, setsortBy] = useState(false)
  const [searchItem, setSearchItem] = useState("")
  const [currentpage, setcurrentpage] = useState(1)
  const [order, setorder] = useState("desc")
  const [userRole, setUserRole] = useState("")

  const onSubmit = (data) => {
    setSearchItem(data.title)
    setcurrentpage(1)
    settotalpages(1)
  }
  const getUser = async () => {
    try {
      const res = await userInstance.get('http://localhost:8000/user/getUser', {
      });
      if (res.data.success) {
        setUserRole(res.data.data.role)
      }
    }
    catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getUser()
  }, [])
  const fetchNotes = async () => {
    const data = {
      "title": searchItem,
      "page": currentpage,
      "order": order
    }
    try {
      const res = await notesInstance.post("http://localhost:8000/note/getAll", data
      )
      if (res.data.success) {
        setNotes(res.data.message)
        setUser(res.data.user)
        settotalpages(res.data.totalpages)
        setTriggeredEvent(false)
      }
    }
    catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    fetchNotes()
  }, [currentpage, searchItem, order, triggeredEvent])

  const handleNoteClick = (noteId) => {
    setNoteId(noteId);
    const note = notes.find(note => note._id === noteId);
    setSelectedNote(note);
  }
  return (
    <>
      <div className='min-h-screen bg-purple-200 '>
        <Header redirect={{ path: "Logout" }}></Header>
        <div className='flex flex-col  sm:flex-row items-center justify-between p-2'>
          <div className="text-2xl font-serif p-2">Welcome,{user}</div>
          <div className='flex items-center gap-3'>
            {(userRole === "admin") && <GetAllUsers></GetAllUsers>}
            <UserDetails></UserDetails>
          </div>
        </div>
        <form className="max-w-md mx-auto mt-5 b" onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col md:flex-row m-2 md:items-center gap-5'>
            <div className='flex-grow' >
              <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                </div>
                {userRole === "user" ? (<input type="search" name="title" id="default-search" className="block item-stretch w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter The Note " {...register("title")} />) : (
                  <input type="search" name="title" id="default-search" className="block w-full p-4 ps-10  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter The Author " {...register("title")} />
                )}
                <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Search</button>
              </div>
            </div>
            <div>
              <div className="relative inline-block text-left">
                <div className='text-center'>
                  <button type="button" className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true" onClick={() => { setsortBy(true) }}>
                    Sort By
                    <svg className="-mr-1 size-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                      <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                {(sortBy) && <div className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                  <div className="py-1" role="none">
                    <div href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="menu-item-0" onClick={() => {
                      setsortBy(false)
                      setorder("desc")
                    }}>Recent</div>
                    <div className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="menu-item-1" onClick={() => {
                      setsortBy(false)
                      setorder("asc")
                    }}>Oldest</div>
                  </div>
                </div>}

              </div>

            </div>
          </div>
        </form>
        <AddNote></AddNote>
        {(userRole === "user") && <Chat></Chat>}
        <div className="mx-auto container py-10 px-6">
          {notes.length === 0 && (
            <p className="mt-4 text-center text-2xl font-serif">No notes present</p>)}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {notes.map((note, i) => {
              return <div key={i} onClick={() => handleNoteClick(note._id)}>
                <div className="rounded">
                  <div className="w-full h-64 flex flex-col justify-between  bg-white  rounded-lg border border-gray-400 mb-6 py-5 px-4">
                    <div>
                      <h4 className="text-gray-800 font-bold mb-3">{note.title}</h4>
                      <p className="text-gray-800 text-sm overflow-scroll scrollbar-hide">{note.description}</p>
                    </div>
                    <div>
                      {(userRole === 'admin') && <i className="text-gray-800 text-l overflow-scroll scrollbar-hide">Author:{note.author}</i>}
                      <div className="flex items-center justify-between text-gray-800">
                        <p className="text-sm">{new Date(note.updatedAt).toLocaleDateString()}</p>
                        <div className='flex gap-3'>
                          <ViewNote></ViewNote>
                          <FileUpload></FileUpload>
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
        {notes.length !== 0 && (
          <div className='flex justify-center gap-4 pb-40 lg:pb-0'>
            <button disabled={currentpage == 1} onClick={() => setcurrentpage(currentpage - 1)}><FaArrowAltCircleLeft size={25} /></button>
            <pre>{currentpage} of {totalpages}</pre>
            <button disabled={currentpage == totalpages} onClick={() => setcurrentpage(currentpage + 1)}><FaArrowAltCircleRight size={25} /></button>
          </div>)}
        <div className="text-6xl text-center">{message}</div>
        <Footer></Footer>
      </div>
    </>
  )
}