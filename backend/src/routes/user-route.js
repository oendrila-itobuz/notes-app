import express from 'express';
import { register, login, logout, regenerate, resendMail } from '../controller/user-controller.js';
import { verification } from '../middleware/registration-token-verifier.js';
import { hasToken } from '../middleware/hasToken.js';
import { validateUser, userSchema } from '../validators/user-details-verifier.js';

const route = express.Router();

route.post('/register', validateUser(userSchema), register);
route.get('/verify', verification);
route.post('/login', login)
route.get('/logout', hasToken, logout)
route.post('/regenerateToken', regenerate) //regeneration of access token
route.post('/resendMail', resendMail) //resend mail for verification(if registration token expires)

export default route;