// app/api/admin/drivers/[id]/availability/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import mysql from 'mysql2/promise';

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

// PATCH - Toggle driver availability
export async function PATCH(
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
    const { isAvailable } = body;

    if (isAvailable === undefined) {
      return NextResponse.json(
        { error: 'isAvailable field is required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Check if driver exists
    const [existing]: any = await connection.execute(
      'SELECT id FROM driver WHERE id = ?',
      [driverId]
    );

    if (existing.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    // Update availability
    await connection.execute(
      'UPDATE driver SET isAvailable = ? WHERE id = ?',
      [isAvailable ? 1 : 0, driverId]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: `Driver ${isAvailable ? 'marked as available' : 'marked as unavailable'}`,
      isAvailable
    });

  } catch (error: any) {
    console.error('Driver Availability API error:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}