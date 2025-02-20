import express from 'express';
import { getChat, sendChat } from '../controller/chat-controller.js'


const routeChat = express.Router();

routeChat.post('/sendChat',sendChat);
routeChat.post('/getChat',getChat);

export default routeChat