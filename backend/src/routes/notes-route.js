import express from 'express';
import { addNote, deleteNote, getNote, searchNote, updateNote } from '../controller/notes-controller.js';
import { hasToken } from '../middleware/hasToken.js';
import { validateNote, noteSchema } from '../middleware/note-details-verifier.js';

const routeNote = express.Router();
routeNote.post('/addNote', hasToken, validateNote(noteSchema), addNote);
routeNote.get('/getNotes', hasToken, getNote)
routeNote.get('/searchNote/:id', hasToken, searchNote)
routeNote.put('/update/:id', hasToken, validateNote(noteSchema), updateNote)
routeNote.delete('/delete/:id', hasToken, deleteNote)

export default routeNote