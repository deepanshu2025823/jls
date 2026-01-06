// app/api/vehicles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('id');
    const type = searchParams.get('type');
    const available = searchParams.get('available');

    if (vehicleId) {
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
        include: {
          driver: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  phone: true,
                  profileImage: true
                }
              }
            }
          }
        }
      });

      if (!vehicle) {
        return NextResponse.json({
          success: false,
          message: 'Vehicle not found'
        }, { status: 404 });
      }

      return NextResponse.json({ success: true, vehicle });
    }

    const where: any = {};
    
    if (type) {
      where.type = type;
    }
    
    if (available !== null) {
      where.isAvailable = available === 'true';
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: {
        driver: {
  select: {
    rating: true,  
    user: {
      select: {
        firstName: true,
        lastName: true
      }
    }
  }
}
      },
      orderBy: { pricePerHour: 'asc' }
    });

    return NextResponse.json({ success: true, vehicles });

  } catch (error: any) {
    console.error('Get vehicles error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch vehicles'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      type,
      brand,
      model,
      year,
      capacity,
      luggageCapacity,
      pricePerHour,
      images,
      features,
      isADACompliant = false,
      licensePlate,
      driverId
    } = body;

    const vehicle = await prisma.vehicle.create({
      data: {
        name,
        type,
        brand,
        model,
        year: parseInt(year),
        capacity: parseInt(capacity),
        luggageCapacity: parseInt(luggageCapacity),
        pricePerHour: parseFloat(pricePerHour),
        images: JSON.stringify(images),
        features: JSON.stringify(features),
        isADACompliant,
        licensePlate,
        driverId: driverId || null,
        isAvailable: true
      }
    });

    return NextResponse.json({
      success: true,
      vehicle,
      message: 'Vehicle created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create vehicle error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to create vehicle'
    }, { status: 500 });
  }
}
