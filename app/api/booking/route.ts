import { dbConfig } from '@/lib/db';
// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      customerId,
      vehicleId,
      bookingType,
      tripType,
      pickupLocation,
      dropLocation,
      pickupDate,
      pickupTime,
      flightNumber,
      pickupSign,
      specialNotes,
      referenceCode,
      basePrice,
      addonPrice = 0,
      totalPrice,
      addons = []
    } = body;

    const bookingNumber = `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const booking = await prisma.$transaction(async (tx) => {
      
      const newBooking = await tx.booking.create({
        data: {
          bookingNumber,
          customerId,
          vehicleId,
          bookingType: bookingType || 'INDIVIDUAL',
          tripType: tripType || 'SINGLE_TRIP',
          pickupLocation,
          dropLocation,
          pickupDate: new Date(pickupDate),
          pickupTime,
          flightNumber: flightNumber || null,
          pickupSign: pickupSign || null,
          specialNotes: specialNotes || null,
          referenceCode: referenceCode || null,
          status: 'PENDING',
          basePrice: parseFloat(basePrice),
          addonPrice: parseFloat(addonPrice),
          totalPrice: parseFloat(totalPrice),
          isPaid: false
        }
      });

      if (addons && addons.length > 0) {
        await tx.bookingAddon.createMany({
          data: addons.map((addon: any) => ({
            bookingId: newBooking.id,
            addonId: addon.addonId,
            quantity: addon.quantity || 1,
            price: parseFloat(addon.price)
          }))
        });
      }

      return newBooking;
    });

    return NextResponse.json({
      success: true,
      booking,
      message: 'Booking created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Booking creation error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to create booking'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const bookingId = searchParams.get('bookingId');

    if (bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          vehicle: true,
          driver: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  phone: true
                }
              }
            }
          },
          addons: {
            include: {
              addon: true
            }
          },
          payment: true
        }
      });

      if (!booking) {
        return NextResponse.json({
          success: false,
          message: 'Booking not found'
        }, { status: 404 });
      }

      return NextResponse.json({ success: true, booking });
    }

    if (customerId) {
      const bookings = await prisma.booking.findMany({
        where: { customerId },
        include: {
          vehicle: true,
          driver: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({ success: true, bookings });
    }

    return NextResponse.json({
      success: false,
      message: 'Missing required parameters'
    }, { status: 400 });

  } catch (error: any) {
    console.error('Get booking error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch bookings'
    }, { status: 500 });
  }
}
