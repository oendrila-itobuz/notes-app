import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import Header from './../components/Header'
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const accessToken = localStorage.getItem("accessToken");
  const [notes, setNotes] = useState([])
  const [user, setUser] = useState("")
  const [message, setmessage] = useState("")
  const { register, handleSubmit, formState } = useForm({});
  const navigate = useNavigate();
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
      const res = await axios.post("http://localhost:8000/note/filterNote",data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if(res.data.success)
      {
        console.log("hii")
        setNotes(res.data.data)
        setmessage("")
      }
      else{
     setmessage("No notes found")

}
    } catch (error) {
      console.log(error.message)
    }
  }
  const logout = async () =>{
    try {
      console.log("hii")
      const res = await axios.post("http://localhost:8000/user/logout",{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    if(res.data.success){
      navigate("/home")
      setNotes[[]]
    }}
      catch(error){

      }
  }
  return (
    <>
      <Header redirect={{ path: "logout" }} onclick={logout}></Header>
      <div class="text-6xl text-center">hello {user}</div>
      <form class="max-w-md mx-auto mt-5 b" onSubmit={handleSubmit(searchNotes)}>
        <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div class="relative">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input type="search" name="title" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." {...register("title")} />
          <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
        </div>
      </form>
      <button class="w-8 h-8 mx-auto mt-6 rounded-full bg-blue-800 dark:bg-blue-800 dark:text-white-800 text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-black" aria-label="edit note" role="button">+</button>

      <div class="mx-auto container py-20 px-6">
        <div class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {notes.map((note, i) => {
            return <div key={i}>
              <div class="rounded">
                <div class="w-full h-64 flex flex-col justify-between dark:bg-gray-800 bg-white dark:border-gray-700 rounded-lg border border-gray-400 mb-6 py-5 px-4">
                  <div>
                    <h4 class="text-gray-800 dark:text-gray-100 font-bold mb-3">{note.title}</h4>
                    <p class="text-gray-800 dark:text-gray-100 text-sm">{note.description}</p>
                  </div>
                  <div>
                    <div class="flex items-center justify-between text-gray-800 dark:text-gray-100">
                      <p class="text-sm">{new Date(note.updatedAt).toLocaleDateString()}</p>
                      <button class="w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-100 dark:text-gray-800 text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-black" aria-label="edit note" role="button">
                        <img class="dark:hidden" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/4-by-3-multiple-styled-cards-svg1.svg" alt="edit" />
                        <img class="dark:block hidden" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/4-by-3-multiple-styled-cards-svg1dark.svg" alt="edit" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          })}
        </div>
      </div>
      <div class="text-6xl text-center">{message}</div>
    </>
  )
}
