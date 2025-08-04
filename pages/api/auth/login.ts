import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../../../src/config/app.config';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    // email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate JWT secret is available
    if (!config.jwt.secret) {
      console.error('JWT_SECRET environment variable is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Find existing user or create new one
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    let isNewUser = false;
    if (!user) {
      // Create new user if doesn't exist
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
        },
      });
      isNewUser = true;
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Return success response with token
    return res.status(200).json({
      success: true,
      message: isNewUser ? 'User created and logged in' : 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process login request'
    });
  } finally {
    await prisma.$disconnect();
  }
}
