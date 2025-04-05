import express from 'express';
import { signup,login,logout } from '../controllers/auth.controller.js';
//create the router for the auth routes

export const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout);