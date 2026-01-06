import { NextRequest, NextResponse } from 'next/server';
import { dbConfig } from '@/lib/db';
import mysql from 'mysql2/promise';

export async function GET(request: NextRequest) {
  let connection;
  
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    connection = await mysql.createConnection(dbConfig);

    const [bookings]: any = await connection.execute(
      `SELECT b.*, 
        u.firstName as customerFirstName, 
        u.lastName as customerLastName,
        v.name as vehicleName
      FROM booking b
      LEFT JOIN user u ON b.customerId = u.id
      LEFT JOIN vehicle v ON b.vehicleId = v.id
      ORDER BY b.createdAt DESC`
    );

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error('Bookings GET API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

export async function POST(request: NextRequest) {
  let connection;
  
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      customerId, vehicleId, bookingType, tripType,
      pickupLocation, dropLocation, pickupDate, pickupTime,
      flightNumber, pickupSign, specialNotes, referenceCode,
      paymentType, basePrice, addonPrice, totalPrice,
      addons, extraStops
    } = body;

    connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();

    // Generate booking number
    const bookingNumber = `JLS${Date.now()}`;

    // Insert booking
    const [result]: any = await connection.execute(
      `INSERT INTO booking (
        id, bookingNumber, customerId, vehicleId, bookingType, tripType,
        pickupLocation, dropLocation, pickupDate, pickupTime,
        flightNumber, pickupSign, specialNotes, referenceCode,
        paymentType, basePrice, addonPrice, totalPrice,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        `booking_${Date.now()}`, bookingNumber, customerId, vehicleId,
        bookingType, tripType, pickupLocation, dropLocation,
        pickupDate, pickupTime, flightNumber, pickupSign,
        specialNotes, referenceCode, paymentType,
        basePrice, addonPrice, totalPrice
      ]
    );

    const bookingId = `booking_${Date.now()}`;

    // Insert addons
    if (addons && addons.length > 0) {
      for (const addon of addons) {
        await connection.execute(
          `INSERT INTO bookingaddon (id, bookingId, addonId, quantity, price)
           VALUES (?, ?, ?, ?, ?)`,
          [`addon_${Date.now()}_${Math.random()}`, bookingId, addon.addonId, addon.quantity, addon.price]
        );
      }
    }

    // Insert extra stops
    if (extraStops && extraStops.length > 0) {
      for (const stop of extraStops) {
        await connection.execute(
          `INSERT INTO extrastop (id, bookingId, location, stopOrder, notes)
           VALUES (?, ?, ?, ?, ?)`,
          [`stop_${Date.now()}_${Math.random()}`, bookingId, stop.location, stop.stopOrder, stop.notes]
        );
      }
    }

    await connection.commit();

    return NextResponse.json({
      message: 'Booking created successfully',
      bookingId,
      bookingNumber
    }, { status: 201 });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Booking POST API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}