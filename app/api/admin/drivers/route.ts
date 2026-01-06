// app/api/admin/drivers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'jls',
};

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

// GET - List all drivers
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

    const [drivers]: any = await connection.execute(
      `SELECT 
        d.id,
        d.userId,
        CONCAT(u.firstName, ' ', u.lastName) as userName,
        u.email,
        u.phone,
        u.profileImage,
        d.licenseNumber,
        d.licenseExpiry,
        d.experience,
        d.rating,
        d.totalTrips,
        d.isAvailable,
        d.currentLocation,
        v.name as vehicleName
      FROM driver d
      JOIN user u ON d.userId = u.id
      LEFT JOIN vehicle v ON v.driverId = d.id
      WHERE u.isActive = 1
      ORDER BY u.firstName ASC`
    );

    await connection.end();

    return NextResponse.json({ drivers });

  } catch (error: any) {
    console.error('Drivers GET API error:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new driver
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
    const { 
      firstName, lastName, email, phone, password, 
      licenseNumber, licenseExpiry, experience, currentLocation 
    } = body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !password || !licenseNumber || !licenseExpiry || experience === undefined) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Check if email already exists
    const [existingEmail]: any = await connection.execute(
      'SELECT id FROM user WHERE email = ?',
      [email]
    );

    if (existingEmail.length > 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Check if license number already exists
    const [existingLicense]: any = await connection.execute(
      'SELECT id FROM driver WHERE licenseNumber = ?',
      [licenseNumber]
    );

    if (existingLicense.length > 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'License number already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate UUIDs
    const userId = crypto.randomUUID();
    const driverId = crypto.randomUUID();

    // Start transaction
    await connection.beginTransaction();

    try {
      // Insert user
      await connection.execute(
        `INSERT INTO user 
          (id, email, password, firstName, lastName, phone, role, membershipStatus, isActive, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, 'DRIVER', 'STANDARD', 1, NOW(), NOW())`,
        [userId, email, hashedPassword, firstName, lastName, phone]
      );

      // Insert driver
      await connection.execute(
        `INSERT INTO driver 
          (id, userId, licenseNumber, licenseExpiry, experience, rating, totalTrips, isAvailable, currentLocation)
        VALUES (?, ?, ?, ?, ?, 0, 0, 1, ?)`,
        [driverId, userId, licenseNumber, licenseExpiry, experience, currentLocation || null]
      );

      await connection.commit();
      await connection.end();

      return NextResponse.json({
        success: true,
        message: 'Driver created successfully',
        driverId
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    }

  } catch (error: any) {
    console.error('Drivers POST API error:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}