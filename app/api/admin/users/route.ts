import { dbConfig } from '@/lib/db';
// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';



const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function verifyAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded: any = verify(token, JWT_SECRET);
    
    if (decoded.role !== 'ADMIN') {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
}

// GET - List all users
export async function GET(request: NextRequest) {
  let connection;

  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    const [users]: any = await connection.execute(
      `SELECT 
        id, email, firstName, lastName, phone, role, 
        membershipStatus, profileImage, isActive, createdAt, updatedAt
      FROM user
      ORDER BY createdAt DESC`
    );

    await connection.end();

    return NextResponse.json({ users });

  } catch (error: any) {
    console.error('Users GET API error:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  let connection;

  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email, password, firstName, lastName, phone, role, membershipStatus, isActive } = body;

    // Validation
    if (!email || !password || !firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Check if email already exists
    const [existing]: any = await connection.execute(
      'SELECT id FROM user WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate UUID
    const userId = crypto.randomUUID();

    // Insert user
    await connection.execute(
      `INSERT INTO user 
        (id, email, password, firstName, lastName, phone, role, membershipStatus, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [userId, email, hashedPassword, firstName, lastName, phone, role || 'CUSTOMER', membershipStatus || 'STANDARD', isActive !== false ? 1 : 0]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      userId
    });

  } catch (error: any) {
    console.error('Users POST API error:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
