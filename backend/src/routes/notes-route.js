import express from 'express';
import { addNote, deleteNote, getNote, searchNote, updateNote, filterNote, pagination, sorting, attachFile } from '../controller/notes-controller.js';
import { hasToken } from '../middleware/hasToken.js';
import { validateNote, noteSchema } from '../validators/note-details-verifier.js';
import {upload} from '../controller/multer.js'

const routeNote = express.Router();

routeNote.post('/addNote', hasToken, validateNote(noteSchema), addNote);
routeNote.get('/getNotes', hasToken, getNote)
routeNote.get('/searchNote/:id', hasToken, searchNote)
routeNote.post('/filterNote', hasToken, filterNote)
routeNote.put('/update/:id', hasToken, validateNote(noteSchema), updateNote)
routeNote.delete('/delete/:id', hasToken, deleteNote)
routeNote.get('/pagination', hasToken, pagination)
routeNote.get('/sorting', hasToken, sorting)
routeNote.post('/uploadFile/:id',hasToken,upload.single('image'), attachFile)
export default routeNote