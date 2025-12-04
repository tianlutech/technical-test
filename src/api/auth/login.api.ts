import { NextApiRequest, NextApiResponse } from 'next';
import { authService } from '@/src/service/auth.service';
import { loginValidator } from '@/src/validators/auth.validator';
import { config } from '@/src/config/env';
import nodemailer from 'nodemailer';

// Create Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: config.gmailUser,
    pass: config.gmailAppPassword,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const data = loginValidator.parse(req.body);
    const { loginUrl } = await authService.sendLoginEmail(data.email);

    // Calculate expiration time (15 minutes from now)
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 15);
    const timeString = expirationTime.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    // Send email via Gmail SMTP
    await transporter.sendMail({
      from: `"Tianlu Tech" <${config.gmailUser}>`,
      to: data.email,
      subject: 'Your Login Link - Tianlu Tech',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p>To authenticate, please use this link:</p>
          <h2 style="font-size: 24px; font-weight: bold; margin: 20px 0;">
            <a href="${loginUrl}" style="color: #2563eb; text-decoration: none;">Click here to login</a>
          </h2>
          <p>Or copy this link: <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${loginUrl}</code></p>
          <p>This link will be valid for 15 minutes till <strong>${timeString}</strong>.</p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            Do not share this link with anyone. If you didn't make this request, you can safely ignore this email.<br/>
            <span style="color: #f97316;">Tianlu Tech</span> will never contact you about this email or ask for any login codes or links. Beware of phishing scams.
          </p>
          <p style="margin-top: 20px;">Thanks for visiting <span style="color: #f97316;">Tianlu Tech</span>!</p>
        </div>
      `,
    });

    return res.status(200).json({ message: 'Login email sent successfully' });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message });
    }

    console.error('Login error:', error);
    return res.status(500).json({ message: 'Failed to send login email' });
  }
}

