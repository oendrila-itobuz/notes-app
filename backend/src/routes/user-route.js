import express from 'express';
import { register,verification} from '../controller/user-controller.js';


const route = express.Router();

route.post('/register', register);
route.get('/verify/:token',verification);

export default route;