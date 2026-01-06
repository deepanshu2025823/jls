// app/api/admin/vehicles/[id]/route.ts
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

// PUT - Update vehicle
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

    const vehicleId = params.id;
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

    // Check if vehicle exists
    const [existing]: any = await connection.execute(
      'SELECT id FROM vehicle WHERE id = ?',
      [vehicleId]
    );

    if (existing.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    // Check if license plate is taken by another vehicle
    const [plateCheck]: any = await connection.execute(
      'SELECT id FROM vehicle WHERE licensePlate = ? AND id != ?',
      [licensePlate, vehicleId]
    );

    if (plateCheck.length > 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'License plate already exists' },
        { status: 400 }
      );
    }

    // If driver is assigned, check if driver already has another vehicle
    if (driverId) {
      const [driverVehicle]: any = await connection.execute(
        'SELECT id FROM vehicle WHERE driverId = ? AND id != ?',
        [driverId, vehicleId]
      );

      if (driverVehicle.length > 0) {
        await connection.end();
        return NextResponse.json(
          { error: 'Driver already has another vehicle assigned' },
          { status: 400 }
        );
      }
    }

    // Update vehicle
    await connection.execute(
      `UPDATE vehicle SET 
        name = ?, 
        type = ?, 
        brand = ?, 
        model = ?, 
        year = ?, 
        capacity = ?, 
        luggageCapacity = ?, 
        pricePerHour = ?, 
        images = ?, 
        features = ?, 
        isADACompliant = ?, 
        isAvailable = ?, 
        licensePlate = ?, 
        driverId = ?,
        updatedAt = NOW()
      WHERE id = ?`,
      [
        name, type, brand, model, year, capacity, luggageCapacity, 
        pricePerHour, images || '', features || '', isADACompliant ? 1 : 0, 
        isAvailable ? 1 : 0, licensePlate, driverId || null, vehicleId
      ]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'Vehicle updated successfully'
    });

  } catch (error: any) {
    console.error('Vehicles PUT API error:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete vehicle
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

    const vehicleId = params.id;

    connection = await mysql.createConnection(dbConfig);

    // Check if vehicle exists
    const [existing]: any = await connection.execute(
      'SELECT id FROM vehicle WHERE id = ?',
      [vehicleId]
    );

    if (existing.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    // Check for active bookings
    const [activeBookings]: any = await connection.execute(
      `SELECT id FROM booking 
       WHERE vehicleId = ? 
       AND status IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS')`,
      [vehicleId]
    );

    if (activeBookings.length > 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Cannot delete vehicle with active bookings' },
        { status: 400 }
      );
    }

    // Delete vehicle
    await connection.execute(
      'DELETE FROM vehicle WHERE id = ?',
      [vehicleId]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });

  } catch (error: any) {
    console.error('Vehicles DELETE API error:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}