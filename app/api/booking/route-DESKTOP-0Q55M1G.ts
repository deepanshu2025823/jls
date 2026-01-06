// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Create a new booking
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
      addons = [],
      extraStops = []
    } = body;

    // Validate required fields
    if (!customerId || !vehicleId || !pickupLocation || !dropLocation || !pickupDate || !pickupTime) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: customerId, vehicleId, pickupLocation, dropLocation, pickupDate, pickupTime are required'
      }, { status: 400 });
    }

    // Verify customer exists
    const customer = await prisma.user.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      return NextResponse.json({
        success: false,
        message: 'Customer not found'
      }, { status: 404 });
    }

    // Verify vehicle exists and is available
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    });

    if (!vehicle) {
      return NextResponse.json({
        success: false,
        message: 'Vehicle not found'
      }, { status: 404 });
    }

    if (!vehicle.isAvailable) {
      return NextResponse.json({
        success: false,
        message: 'Vehicle is not available'
      }, { status: 400 });
    }

    // Generate unique booking number
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    const bookingNumber = `BK${timestamp}${random}`;

    // Create booking with addons and extra stops in a transaction
    const booking = await prisma.$transaction(async (tx) => {
      // Create the main booking
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
          paymentType: 'INSTANT_BILLING',
          basePrice: parseFloat(basePrice.toString()),
          addonPrice: parseFloat(addonPrice.toString()),
          totalPrice: parseFloat(totalPrice.toString()),
          tipAmount: 0,
          isPaid: false
        },
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
          vehicle: {
            select: {
              id: true,
              name: true,
              type: true,
              brand: true,
              model: true,
              capacity: true,
              luggageCapacity: true,
              pricePerHour: true
            }
          }
        }
      });

      // Create booking addons if any
      if (addons && Array.isArray(addons) && addons.length > 0) {
        const addonData = addons.map((addon: any) => ({
          bookingId: newBooking.id,
          addonId: addon.addonId,
          quantity: addon.quantity || 1,
          price: parseFloat(addon.price.toString())
        }));

        await tx.bookingAddon.createMany({
          data: addonData
        });
      }

      // Create extra stops if any
      if (extraStops && Array.isArray(extraStops) && extraStops.length > 0) {
        const stopData = extraStops.map((stop: any, index: number) => ({
          bookingId: newBooking.id,
          location: stop.location,
          stopOrder: stop.stopOrder || index + 1,
          notes: stop.notes || null
        }));

        await tx.extraStop.createMany({
          data: stopData
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
    console.error('❌ Booking creation error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to create booking',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// GET - Retrieve bookings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const bookingId = searchParams.get('bookingId');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    // Get single booking by ID
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
              phone: true,
              membershipStatus: true
            }
          },
          vehicle: {
            select: {
              id: true,
              name: true,
              type: true,
              brand: true,
              model: true,
              year: true,
              capacity: true,
              luggageCapacity: true,
              pricePerHour: true,
              features: true,
              images: true
            }
          },
          driver: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  phone: true,
                  profileImage: true
                }
              }
            }
          },
          bookingAddons: {
            include: {
              addon: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                  description: true,
                  price: true,
                  icon: true
                }
              }
            }
          },
          extraStops: {
            orderBy: {
              stopOrder: 'asc'
            }
          },
          payment: true,
          review: true
        }
      });

      if (!booking) {
        return NextResponse.json({
          success: false,
          message: 'Booking not found'
        }, { status: 404 });
      }

      return NextResponse.json({ 
        success: true, 
        booking 
      });
    }

    // Get bookings with filters
    const where: any = {};
    
    if (customerId) {
      where.customerId = customerId;
    }
    
    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        vehicle: {
          select: {
            name: true,
            type: true,
            brand: true,
            model: true
          }
        },
        driver: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        payment: {
          select: {
            status: true,
            amount: true
          }
        }
      },
      orderBy: { 
        createdAt: 'desc' 
      },
      take: limit ? parseInt(limit) : undefined
    });

    return NextResponse.json({ 
      success: true, 
      bookings,
      count: bookings.length
    });

  } catch (error: any) {
    console.error('❌ Get booking error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch bookings',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// PATCH - Update booking
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, status, driverId, tipAmount, specialNotes } = body;

    if (!bookingId) {
      return NextResponse.json({
        success: false,
        message: 'Booking ID is required'
      }, { status: 400 });
    }

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!existingBooking) {
      return NextResponse.json({
        success: false,
        message: 'Booking not found'
      }, { status: 404 });
    }

    // Build update data
    const updateData: any = {};
    
    if (status) {
      // Validate status
      const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({
          success: false,
          message: 'Invalid status value'
        }, { status: 400 });
      }
      updateData.status = status;
    }
    
    if (driverId !== undefined) {
      // Verify driver exists if provided
      if (driverId) {
        const driver = await prisma.driver.findUnique({
          where: { id: driverId }
        });
        if (!driver) {
          return NextResponse.json({
            success: false,
            message: 'Driver not found'
          }, { status: 404 });
        }
      }
      updateData.driverId = driverId;
    }
    
    if (tipAmount !== undefined) {
      updateData.tipAmount = parseFloat(tipAmount.toString());
    }
    
    if (specialNotes !== undefined) {
      updateData.specialNotes = specialNotes;
    }

    // Update booking
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        vehicle: {
          select: {
            name: true,
            type: true,
            brand: true,
            model: true
          }
        },
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
        }
      }
    });

    return NextResponse.json({
      success: true,
      booking,
      message: 'Booking updated successfully'
    });

  } catch (error: any) {
    console.error('❌ Update booking error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to update booking',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// DELETE - Cancel/Delete booking
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return NextResponse.json({
        success: false,
        message: 'Booking ID is required'
      }, { status: 400 });
    }

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        payment: true
      }
    });

    if (!existingBooking) {
      return NextResponse.json({
        success: false,
        message: 'Booking not found'
      }, { status: 404 });
    }

    // Don't allow deletion of paid bookings - only cancellation
    if (existingBooking.isPaid) {
      // Update status to cancelled instead of deleting
      const cancelledBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' }
      });

      return NextResponse.json({
        success: true,
        message: 'Booking cancelled successfully',
        booking: cancelledBooking
      });
    }

    // Delete booking if not paid (this will cascade delete related records)
    await prisma.booking.delete({
      where: { id: bookingId }
    });

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully'
    });

  } catch (error: any) {
    console.error('❌ Delete booking error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to delete booking',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}