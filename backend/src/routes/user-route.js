import express from 'express';
import { register, login } from '../controller/user-controller.js';
import { verification } from '../middleware/token-verifier.js';
import { validateUser, userSchema } from '../middleware/user-details-verifier.js';

const route = express.Router();

route.post('/register', validateUser(userSchema), register);
route.get('/verify', verification);
route.post('/login', login)

export default route;