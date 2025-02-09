import { useState } from 'react'
import { createContext } from 'react'

const NoteContext = createContext()

function NoteProvider(props) {

  const [notes, setNotes] = useState([ ])
  const [noteId,setNoteId] = useState()
   const [Selectednote, setSelectedNote ] = useState({})
  return <>

    <NoteContext.Provider value={{ notes, setNotes, setNoteId, noteId ,Selectednote,setSelectedNote}}>

      {props.children}

    </NoteContext.Provider>

  </>
}

export { NoteContext, NoteProvider }