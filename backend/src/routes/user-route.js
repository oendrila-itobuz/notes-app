import express from 'express';
import { register, login ,logout , regenerate} from '../controller/user-controller.js';
import { verification } from '../middleware/registration-token-verifier.js';
import { hasToken } from '../middleware/hasToken.js';
import { validateUser, userSchema } from '../middleware/user-details-verifier.js';

const route = express.Router();

route.post('/register', validateUser(userSchema), register);
route.get('/verify', verification);
route.post('/login', login)
route.post('/logout',hasToken,logout)
route.post('/regenerateToken', regenerate)
export default route;