// app/api/admin/drivers/[id]/route.ts
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

// PUT - Update driver
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let connection;

  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const driverId = params.id;
    const body = await request.json();
    const { 
      firstName, lastName, email, phone, password, 
      licenseNumber, licenseExpiry, experience, currentLocation 
    } = body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !licenseNumber || !licenseExpiry || experience === undefined) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Check if driver exists
    const [existing]: any = await connection.execute(
      'SELECT userId FROM driver WHERE id = ?',
      [driverId]
    );

    if (existing.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    const userId = existing[0].userId;

    // Check if email is taken by another user
    const [emailCheck]: any = await connection.execute(
      'SELECT id FROM user WHERE email = ? AND id != ?',
      [email, userId]
    );

    if (emailCheck.length > 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Check if license number is taken by another driver
    const [licenseCheck]: any = await connection.execute(
      'SELECT id FROM driver WHERE licenseNumber = ? AND id != ?',
      [licenseNumber, driverId]
    );

    if (licenseCheck.length > 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'License number already exists' },
        { status: 400 }
      );
    }

    // Start transaction
    await connection.beginTransaction();

    try {
      // Update user
      let userQuery = `UPDATE user SET 
        email = ?, 
        firstName = ?, 
        lastName = ?, 
        phone = ?,
        updatedAt = NOW()`;
      
      let userParams: any[] = [email, firstName, lastName, phone];

      // If password is provided, update it
      if (password && password.trim() !== '') {
        const hashedPassword = await bcrypt.hash(password, 10);
        userQuery += `, password = ?`;
        userParams.push(hashedPassword);
      }

      userQuery += ` WHERE id = ?`;
      userParams.push(userId);

      await connection.execute(userQuery, userParams);

      // Update driver
      await connection.execute(
        `UPDATE driver SET 
          licenseNumber = ?, 
          licenseExpiry = ?, 
          experience = ?, 
          currentLocation = ?
        WHERE id = ?`,
        [licenseNumber, licenseExpiry, experience, currentLocation || null, driverId]
      );

      await connection.commit();
      await connection.end();

      return NextResponse.json({
        success: true,
        message: 'Driver updated successfully'
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    }

  } catch (error: any) {
    console.error('Drivers PUT API error:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete driver
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let connection;

  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const driverId = params.id;

    connection = await mysql.createConnection(dbConfig);

    // Check if driver exists
    const [existing]: any = await connection.execute(
      'SELECT userId FROM driver WHERE id = ?',
      [driverId]
    );

    if (existing.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    const userId = existing[0].userId;

    // Check for active bookings
    const [activeBookings]: any = await connection.execute(
      `SELECT id FROM booking 
       WHERE driverId = ? 
       AND status IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS')`,
      [driverId]
    );

    if (activeBookings.length > 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Cannot delete driver with active bookings' },
        { status: 400 }
      );
    }

    // Start transaction
    await connection.beginTransaction();

    try {
      // Delete driver (will cascade based on FK constraints)
      // This will also delete the user due to ON DELETE CASCADE
      await connection.execute(
        'DELETE FROM user WHERE id = ?',
        [userId]
      );

      await connection.commit();
      await connection.end();

      return NextResponse.json({
        success: true,
        message: 'Driver deleted successfully'
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    }

  } catch (error: any) {
    console.error('Drivers DELETE API error:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}