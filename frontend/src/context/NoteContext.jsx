import { useState } from 'react'
import AddNote from '../components/AddNote'
import Home from '../pages/Home'

import { createContext } from 'react'

const NoteContext = createContext()

function NoteProvider(props) {

  const [notes, setNotes] = useState([])
  const [noteId,setNoteId] = useState()
  return <>

    <NoteContext.Provider value={{ notes, setNotes, setNoteId, noteId }}>

      {props.children}

    </NoteContext.Provider>

  </>

}

export { NoteContext, NoteProvider }