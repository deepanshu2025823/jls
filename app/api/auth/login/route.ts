// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import { dbConfig } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  let connection;
  
  try {
    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Log for debugging (remove in production after fixing)
    console.log('Login attempt for email:', email);
    console.log('DB Config:', {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      database: process.env.DATABASE_NAME,
      hasPassword: !!process.env.DATABASE_PASSWORD
    });

    // Create database connection
    try {
      connection = await mysql.createConnection(dbConfig);
      console.log('Database connection established');
    } catch (dbError: any) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed', details: dbError.message },
        { status: 500 }
      );
    }

    // Fetch user with their role
    let users;
    try {
      [users] = await connection.execute(
        'SELECT * FROM user WHERE email = ? AND isActive = 1',
        [email]
      );
      console.log('User query executed, found:', (users as any).length, 'users');
    } catch (queryError: any) {
      console.error('User query error:', queryError);
      return NextResponse.json(
        { error: 'Database query failed', details: queryError.message },
        { status: 500 }
      );
    }

    if ((users as any).length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = (users as any)[0];

    // Verify password
    let isPasswordValid;
    try {
      isPasswordValid = await compare(password, user.password);
      console.log('Password verification completed');
    } catch (bcryptError: any) {
      console.error('Password comparison error:', bcryptError);
      return NextResponse.json(
        { error: 'Password verification failed', details: bcryptError.message },
        { status: 500 }
      );
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check JWT_SECRET
    if (!JWT_SECRET || JWT_SECRET === 'your-secret-key') {
      console.error('JWT_SECRET not configured properly');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Generate JWT token with role information
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userData: any = {  
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      membershipStatus: user.membershipStatus,
      profileImage: user.profileImage,
    };

    // If user is a driver, fetch driver details
    if (user.role === 'DRIVER') {
      try {
        const [drivers]: any = await connection.execute(
          'SELECT * FROM driver WHERE userId = ?',
          [user.id]
        );
        if (drivers.length > 0) {
          userData['driverDetails'] = {
            id: drivers[0].id,
            licenseNumber: drivers[0].licenseNumber,
            licenseExpiry: drivers[0].licenseExpiry,
            experience: drivers[0].experience,
            rating: drivers[0].rating,
            totalTrips: drivers[0].totalTrips,
            isAvailable: drivers[0].isAvailable,
          };
        }
      } catch (driverError: any) {
        console.error('Driver details fetch error:', driverError);
        // Continue without driver details
      }
    }

    // If user is corporate, fetch corporate account details
    if (user.role === 'CORPORATE') {
      try {
        const [accounts]: any = await connection.execute(
          'SELECT * FROM corporateaccount WHERE userId = ?',
          [user.id]
        );
        if (accounts.length > 0) {
          userData['corporateDetails'] = {
            id: accounts[0].id,
            companyName: accounts[0].companyName,
            billingAddress: accounts[0].billingAddress,
            taxId: accounts[0].taxId,
            creditLimit: accounts[0].creditLimit,
          };
        }
      } catch (corpError: any) {
        console.error('Corporate details fetch error:', corpError);
        // Continue without corporate details
      }
    }

    return NextResponse.json(
      {
        message: 'Login successful',
        token,
        user: userData,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Login error (main):', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message,
        // Remove in production after debugging
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('Database connection closed');
      } catch (closeError) {
        console.error('Error closing connection:', closeError);
      }
    }
  }
}