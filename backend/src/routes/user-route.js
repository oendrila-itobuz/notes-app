import express from 'express';
import { register, login, logout, regenerate, resendMail, attachFile, getUser, getAllUser, deleteUser } from '../controller/user-controller.js';
import { verification } from '../middleware/registration-token-verifier.js';
import { hasToken } from '../middleware/hasToken.js';
import { validateUser, userSchema } from '../validators/user-details-verifier.js';
import {upload} from '../controller/multer.js'

const route = express.Router();

route.post('/register', validateUser(userSchema), register);
route.get('/verify', verification);
route.post('/login', login)
route.get('/logout', hasToken, logout)
route.get('/regenerateToken', regenerate) //regeneration of access token
route.post('/resendMail', resendMail) //resend mail for verification(if registration token expires)
route.post('/profileUpload',hasToken,upload.single('image'), attachFile)
route.get('/getUser',hasToken,getUser)
route.post('/getAllUser',hasToken,getAllUser) //for admin
route.post('/deleteUser',hasToken,deleteUser) //for admin

export default route;