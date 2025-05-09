import express from 'express';
import { signup,login,logout , updateProfile ,checkAuth } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
//create the router for the auth routes

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout);
//The PUT HTTP method creates a new resource or replaces a representation of the target resource with the request content.
router.put('/update-profile' ,protectRoute, updateProfile)
//check if the user is logged in by protectRoute middleware and then calls to the controllers 
router.get('/check',protectRoute , checkAuth)

export default router;