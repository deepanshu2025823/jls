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
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Fetch user with their role
    const [users]: any = await connection.execute(
      'SELECT * FROM user WHERE email = ? AND isActive = 1',
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
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

    if (user.role === 'DRIVER') {
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
    }

    // If user is corporate, fetch corporate account details
    if (user.role === 'CORPORATE') {
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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}