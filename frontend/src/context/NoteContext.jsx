import { useState } from 'react'
import { createContext } from 'react'

const NoteContext = createContext()

function NoteProvider(props) {

  const [notes, setNotes] = useState([ ])
  const [noteId,setNoteId] = useState()
  const [Selectednote, setSelectedNote ] = useState({})
  const [loggedIn,setLoggedIn] = useState("false")
  const [user, setUser] = useState("")
  localStorage.setItem("loginStatus",loggedIn)
  const [triggeredEvent,setTriggeredEvent] =useState("false")
  const [totalpages,settotalpages] =useState("1")
  return <>

    <NoteContext.Provider value={{ notes, setNotes, setNoteId, noteId ,Selectednote,setSelectedNote,loggedIn,setLoggedIn,triggeredEvent,setTriggeredEvent,user,setUser,totalpages,settotalpages}}>

      {props.children}

    </NoteContext.Provider>

  </>
}

export { NoteContext, NoteProvider }