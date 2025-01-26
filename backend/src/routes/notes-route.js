import express from 'express';
import {addNote} from '../controller/notes-controller.js';


const routeN = express.Router();
routeN.post('/addNote',addNote);

export default routeN