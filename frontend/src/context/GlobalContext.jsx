import { useState } from 'react'
import { createContext } from 'react'

const GlobalContext = createContext()

function GlobalProvider(props) {

  const [notes, setNotes] = useState([])
  const [noteId, setNoteId] = useState()
  const [Selectednote, setSelectedNote] = useState({})
  const [user, setUser] = useState("")
  const [triggeredEvent, setTriggeredEvent] = useState("false")
  const [totalpages, settotalpages] = useState("1")
  
  return <>

    <GlobalContext.Provider value={{ notes, setNotes, setNoteId, noteId, Selectednote, setSelectedNote, triggeredEvent, setTriggeredEvent, user, setUser, totalpages, settotalpages}}>

      {props.children}

    </GlobalContext.Provider>

  </>
}

export { GlobalContext, GlobalProvider }