import express from 'express';
import { signup,login } from '../controllers/auth.controller.js';
//create the router for the auth routes

export const router = express.Router();

router.post('/signup',signup);
router.get('/login',login);