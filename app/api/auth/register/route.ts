import { dbConfig } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'support@artomatic.in',
    pass: process.env.SMTP_PASSWORD || 'Artomatic@#!2025',
  },
});

async function sendWelcomeEmail(email: string, firstName: string, role: string) {
  const roleDisplay = {
    'ADMIN': 'Administrator',
    'DRIVER': 'Driver',
    'CUSTOMER': 'Customer',
    'CORPORATE': 'Corporate Client'
  }[role] || role;

  const mailOptions = {
    from: '"JLS Worldwide Chauffeured Service" <support@artomatic.in>',
    to: email,
    subject: 'Welcome to JLS Worldwide Chauffeured Service',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff;
          }
          .header { 
            background: #000000; 
            color: #ffffff; 
            padding: 40px 30px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: bold;
          }
          .content { 
            padding: 40px 30px; 
            background: #f9f9f9; 
          }
          .content h2 {
            color: #000000;
            margin-top: 0;
          }
          .content p {
            margin: 15px 0;
          }
          .button { 
            display: inline-block; 
            padding: 15px 40px; 
            background: #000000; 
            color: #ffffff !important; 
            text-decoration: none; 
            border-radius: 50px; 
            margin: 25px 0;
            font-weight: 600;
          }
          .info-box {
            background: #ffffff;
            border-left: 4px solid #000000;
            padding: 15px;
            margin: 20px 0;
          }
          .footer { 
            padding: 30px; 
            text-align: center; 
            color: #666666; 
            font-size: 13px;
            background: #f0f0f0;
          }
          .footer p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>JLS</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px;">Worldwide Chauffeured Service</p>
          </div>
          <div class="content">
            <h2>Welcome to JLS, ${firstName}!</h2>
            <p>Thank you for registering with JLS Worldwide Chauffeured Service. We're excited to have you join our premium transportation family.</p>
            
            <div class="info-box">
              <strong>Account Details:</strong><br>
              Email: ${email}<br>
              Account Type: ${roleDisplay}
            </div>

            <p>Your account has been successfully created and you can now access all our premium services.</p>
            
            <center>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" class="button">Login to Your Account</a>
            </center>

            <p><strong>What's Next?</strong></p>
            <ul>
              <li>Complete your profile</li>
              <li>Browse our luxury fleet</li>
              <li>Book your first ride</li>
              <li>Experience premium service</li>
            </ul>

            <p>If you have any questions or need assistance, our support team is here to help 24/7.</p>
          </div>
          <div class="footer">
            <p><strong>JLS Worldwide Chauffeured Service</strong></p>
            <p>Email: support@artomatic.in</p>
            <p>&copy; ${new Date().getFullYear()} JLS. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

export async function POST(request: NextRequest) {
  let connection;
  
  try {
    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      password, 
      role = 'CUSTOMER',
      // Driver specific fields
      licenseNumber,
      licenseExpiry,
      experience,
      // Corporate specific fields
      companyName,
      billingAddress,
      taxId,
      creditLimit
    } = body;

    // Basic validation
    if (!firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['ADMIN', 'DRIVER', 'CUSTOMER', 'CORPORATE'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role selected' },
        { status: 400 }
      );
    }

    // Driver specific validation
    if (role === 'DRIVER') {
      if (!licenseNumber || !licenseExpiry || !experience) {
        return NextResponse.json(
          { error: 'Driver registration requires license number, expiry date, and experience' },
          { status: 400 }
        );
      }
    }

    // Corporate specific validation
    if (role === 'CORPORATE') {
      if (!companyName || !billingAddress) {
        return NextResponse.json(
          { error: 'Corporate registration requires company name and billing address' },
          { status: 400 }
        );
      }
    }

    connection = await mysql.createConnection(dbConfig);

    // Check if email already exists
    const [existingUsers]: any = await connection.execute(
      'SELECT id FROM user WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Email is already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Generate unique user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Determine membership status based on role
    const membershipStatus = role === 'CORPORATE' ? 'CORPORATE' : role === 'ADMIN' ? 'VIP' : 'STANDARD';

    // Insert user into database
    await connection.execute(
      `INSERT INTO user (id, email, password, firstName, lastName, phone, role, membershipStatus, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [userId, email, hashedPassword, firstName, lastName, phone, role, membershipStatus]
    );

    // Create driver profile if role is DRIVER
    if (role === 'DRIVER') {
      const driverId = `driver_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await connection.execute(
        `INSERT INTO driver (id, userId, licenseNumber, licenseExpiry, experience, rating, totalTrips, isAvailable)
         VALUES (?, ?, ?, ?, ?, 0, 0, 1)`,
        [driverId, userId, licenseNumber, licenseExpiry, parseInt(experience)]
      );
    }

    // Create corporate account if role is CORPORATE
    if (role === 'CORPORATE') {
      const accountId = `corp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await connection.execute(
        `INSERT INTO corporateaccount (id, userId, companyName, billingAddress, taxId, creditLimit, isActive, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
        [
          accountId, 
          userId, 
          companyName, 
          billingAddress, 
          taxId || null, 
          creditLimit ? parseFloat(creditLimit) : null
        ]
      );
    }

    await connection.end();

    // Send welcome email (async, don't wait)
    sendWelcomeEmail(email, firstName, role).catch(err => 
      console.error('Failed to send welcome email:', err)
    );

    // Generate JWT token
    const token = sign(
      {
        userId,
        email,
        role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const user = {
      id: userId,
      email,
      firstName,
      lastName,
      phone,
      role,
      membershipStatus,
    };

    return NextResponse.json(
      {
        message: 'Registration successful',
        token,
        user,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'An error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}
