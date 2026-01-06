import { dbConfig } from '@/lib/db';
// app/api/admin/drivers/available/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import mysql from 'mysql2/promise';



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

// GET - List available drivers (without assigned vehicles)
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

    // Get drivers who don't have vehicles assigned
    const [drivers]: any = await connection.execute(
      `SELECT 
        d.id,
        CONCAT(u.firstName, ' ', u.lastName) as name,
        u.email,
        u.phone,
        d.licenseNumber,
        d.isAvailable
      FROM driver d
      JOIN user u ON d.userId = u.id
      LEFT JOIN vehicle v ON v.driverId = d.id
      WHERE v.id IS NULL AND u.isActive = 1
      ORDER BY u.firstName ASC`
    );

    await connection.end();

    return NextResponse.json({ drivers });

  } catch (error: any) {
    console.error('Available Drivers GET API error:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
