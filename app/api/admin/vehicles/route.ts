import { dbConfig } from '@/lib/db';
// app/api/admin/vehicles/route.ts
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

// GET - List all vehicles
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

    const [vehicles]: any = await connection.execute(
      `SELECT 
        v.*,
        CONCAT(u.firstName, ' ', u.lastName) as driverName
      FROM vehicle v
      LEFT JOIN driver d ON v.driverId = d.id
      LEFT JOIN user u ON d.userId = u.id
      ORDER BY v.createdAt DESC`
    );

    await connection.end();

    return NextResponse.json({ vehicles });

  } catch (error: any) {
    console.error('Vehicles GET API error:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new vehicle
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
      name, type, brand, model, year, capacity, luggageCapacity, 
      pricePerHour, images, features, isADACompliant, isAvailable, 
      licensePlate, driverId 
    } = body;

    // Validation
    if (!name || !type || !brand || !model || !year || !capacity || !luggageCapacity || !pricePerHour || !licensePlate) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Check if license plate already exists
    const [existing]: any = await connection.execute(
      'SELECT id FROM vehicle WHERE licensePlate = ?',
      [licensePlate]
    );

    if (existing.length > 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'License plate already exists' },
        { status: 400 }
      );
    }

    // If driver is assigned, check if driver already has a vehicle
    if (driverId) {
      const [driverVehicle]: any = await connection.execute(
        'SELECT id FROM vehicle WHERE driverId = ?',
        [driverId]
      );

      if (driverVehicle.length > 0) {
        await connection.end();
        return NextResponse.json(
          { error: 'Driver already has a vehicle assigned' },
          { status: 400 }
        );
      }
    }

    // Generate UUID
    const vehicleId = crypto.randomUUID();

    // Insert vehicle
    await connection.execute(
      `INSERT INTO vehicle 
        (id, name, type, brand, model, year, capacity, luggageCapacity, pricePerHour, 
         images, features, isADACompliant, isAvailable, licensePlate, driverId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        vehicleId, name, type, brand, model, year, capacity, luggageCapacity, 
        pricePerHour, images || '', features || '', isADACompliant ? 1 : 0, 
        isAvailable !== false ? 1 : 0, licensePlate, driverId || null
      ]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'Vehicle created successfully',
      vehicleId
    });

  } catch (error: any) {
    console.error('Vehicles POST API error:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
