// app/api/admin/users/[id]/route.ts
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

// PUT - Update user
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

    const userId = params.id;
    const body = await request.json();
    const { email, password, firstName, lastName, phone, role, membershipStatus, isActive } = body;

    // Validation
    if (!email || !firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Check if user exists
    const [existing]: any = await connection.execute(
      'SELECT id FROM user WHERE id = ?',
      [userId]
    );

    if (existing.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

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

    // Build update query
    let updateQuery = `UPDATE user SET 
      email = ?, 
      firstName = ?, 
      lastName = ?, 
      phone = ?, 
      role = ?, 
      membershipStatus = ?, 
      isActive = ?,
      updatedAt = NOW()`;
    
    let params: any[] = [email, firstName, lastName, phone, role, membershipStatus, isActive ? 1 : 0];

    // If password is provided, update it
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += `, password = ?`;
      params.push(hashedPassword);
    }

    updateQuery += ` WHERE id = ?`;
    params.push(userId);

    await connection.execute(updateQuery, params);

    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'User updated successfully'
    });

  } catch (error: any) {
    console.error('Users PUT API error:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
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

    const userId = params.id;

    connection = await mysql.createConnection(dbConfig);

    // Check if user exists
    const [existing]: any = await connection.execute(
      'SELECT id, role FROM user WHERE id = ?',
      [userId]
    );

    if (existing.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent deleting yourself
    if (userId === user.userId) {
      await connection.end();
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // If user is a driver, check for active bookings
    if (existing[0].role === 'DRIVER') {
      const [activeBookings]: any = await connection.execute(
        `SELECT id FROM booking 
         WHERE driverId = (SELECT id FROM driver WHERE userId = ?) 
         AND status IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS')`,
        [userId]
      );

      if (activeBookings.length > 0) {
        await connection.end();
        return NextResponse.json(
          { error: 'Cannot delete driver with active bookings' },
          { status: 400 }
        );
      }
    }

    // Delete user (cascading will handle related records based on FK constraints)
    await connection.execute(
      'DELETE FROM user WHERE id = ?',
      [userId]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error: any) {
    console.error('Users DELETE API error:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}