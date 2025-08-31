import { Router } from 'express';
import { registerUser } from '../controllers/auth.controller';

const router = Router();

// This line says: "When a POST request comes to /register,
// run the registerUser function from the controller."
router.post('/register', registerUser);

export default router;