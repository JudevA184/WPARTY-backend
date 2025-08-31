import { Request, Response } from 'express';
import prisma from '../db'; // Our database client
import bcrypt from 'bcrypt'; // The password hashing library

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