import { Request, Response } from 'express';
import prisma from '../db'; // Our database client
import bcrypt from 'bcrypt'; // The password hashing library
// ...other imports
import jwt from 'jsonwebtoken';

// ...your registerUser function is here...

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by their email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // If no user is found, send an unauthorized error
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 2. Check if the provided password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // If passwords don't match, send an unauthorized error
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. If credentials are valid, generate a JWT
    const token = jwt.sign(
      { userId: user.id }, // The data you want to store in the token
      'YOUR_SUPER_SECRET_KEY', // Your secret key (we'll move this to .env later)
      { expiresIn: '1h' } // The token will be valid for 1 hour
    );

    // 4. Send the token back to the user
    res.json({ token });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    console.log("INCOMING REQUEST BODY:", req.body);
    // 1. Get user data from the request body
    const { email, password, name } = req.body;

    // 2. Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create the new user in the database
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword, // Store the hashed password, not the original
      },
    });

    // 4. Send back a success response
    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    // 5. Handle potential errors (like a duplicate email)
    res.status(400).json({ error: 'User with this email already exists' });
  }
};