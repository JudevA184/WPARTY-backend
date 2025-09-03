import { Router } from 'express';
// Make sure to import both controller functions
import { registerUser, loginUser } from '../controllers/auth.controller';

const router = Router();

// Route for registering a new user
router.post('/register', registerUser);

// Add the new route for logging in
router.post('/login', loginUser);

export default router;