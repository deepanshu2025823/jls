import { dbConfig } from '@/lib/db';
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

    // Get total bookings
    const [bookingsCount]: any = await connection.execute(
      'SELECT COUNT(*) as count FROM booking'
    );
    const totalBookings = bookingsCount[0].count;

    // Get total revenue
    const [revenueResult]: any = await connection.execute(
      'SELECT SUM(totalPrice) as total FROM booking WHERE isPaid = 1'
    );
    const totalRevenue = revenueResult[0].total || 0;

    // Get active drivers
    const [driversCount]: any = await connection.execute(
      'SELECT COUNT(*) as count FROM driver WHERE isAvailable = 1'
    );
    const activeDrivers = driversCount[0].count;

    // Get total customers
    const [customersCount]: any = await connection.execute(
      'SELECT COUNT(*) as count FROM user WHERE role = "CUSTOMER" AND isActive = 1'
    );
    const totalCustomers = customersCount[0].count;

    // Get pending bookings
    const [pendingCount]: any = await connection.execute(
      'SELECT COUNT(*) as count FROM booking WHERE status = "PENDING"'
    );
    const pendingBookings = pendingCount[0].count;

    // Get completed bookings
    const [completedCount]: any = await connection.execute(
      'SELECT COUNT(*) as count FROM booking WHERE status = "COMPLETED"'
    );
    const completedBookings = completedCount[0].count;

    // Get VIP members
    const [vipCount]: any = await connection.execute(
      'SELECT COUNT(*) as count FROM user WHERE membershipStatus = "VIP" AND isActive = 1'
    );
    const vipMembers = vipCount[0].count;

    // Get corporate accounts
    const [corporateCount]: any = await connection.execute(
      'SELECT COUNT(*) as count FROM corporateaccount WHERE isActive = 1'
    );
    const corporateAccounts = corporateCount[0].count;

    // Get total vehicles
    const [vehiclesCount]: any = await connection.execute(
      'SELECT COUNT(*) as count FROM vehicle'
    );
    const totalVehicles = vehiclesCount[0].count;

    // Get available vehicles
    const [availableVehicles]: any = await connection.execute(
      'SELECT COUNT(*) as count FROM vehicle WHERE isAvailable = 1'
    );
    const availableVehiclesCount = availableVehicles[0].count;

    // Get recent bookings with customer names
    const [recentBookings]: any = await connection.execute(
      `SELECT 
        b.id,
        b.bookingNumber,
        b.pickupLocation,
        b.bookingType,
        b.status,
        b.totalPrice,
        b.createdAt,
        CONCAT(u.firstName, ' ', u.lastName) as customerName
      FROM booking b
      JOIN user u ON b.customerId = u.id
      ORDER BY b.createdAt DESC
      LIMIT 10`
    );

    await connection.end();

    const stats = {
      totalBookings,
      totalRevenue,
      activeDrivers,
      totalCustomers,
      pendingBookings,
      completedBookings,
      vipMembers,
      corporateAccounts,
      totalVehicles,
      availableVehicles: availableVehiclesCount,
    };

    return NextResponse.json({
      stats,
      recentBookings: recentBookings.map((booking: any) => ({
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        customerName: booking.customerName,
        pickupLocation: booking.pickupLocation,
        bookingType: booking.bookingType,
        status: booking.status,
        totalPrice: booking.totalPrice,
        createdAt: booking.createdAt,
      })),
    });

  } catch (error: any) {
    console.error('Dashboard API error:', error);
    
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
