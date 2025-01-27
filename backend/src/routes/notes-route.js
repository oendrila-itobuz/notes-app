import express from 'express';
import { addNote, deleteNote, getNote, searchNote, updateNote } from '../controller/notes-controller.js';
import { isLogged } from '../middleware/isLogged.js'
import { hasToken } from '../middleware/hasToken.js';

const routeN = express.Router();

routeN.post('/addNote/:userId', isLogged, hasToken, addNote);
routeN.get('/getNotes/:userId', isLogged, hasToken, getNote)
routeN.get('/searchNote/:userId/:id', isLogged, hasToken, searchNote)
routeN.put('/update/:userId/:id', isLogged, hasToken, updateNote)
routeN.delete('/delete/:userId/:id', isLogged, hasToken, deleteNote)

export default routeN