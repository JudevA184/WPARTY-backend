import { Router } from 'express';
import { protect } from '../middleware/auth.middleware'; // Import our security guard
import prisma from '../db';

const router = Router();

// This route is now protected. The 'protect' middleware will run first.
router.get('/me', protect, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user!.userId, // <-- Add the ! here
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

export default router;