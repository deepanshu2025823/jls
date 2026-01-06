// app/api/vehicles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Retrieve vehicles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('id');
    const type = searchParams.get('type');
    const available = searchParams.get('available');
    const minCapacity = searchParams.get('minCapacity');
    const maxPrice = searchParams.get('maxPrice');

    // Get single vehicle by ID
    if (vehicleId) {
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
        include: {
          driver: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  phone: true,
                  profileImage: true,
                  email: true
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

      // Parse JSON fields
      const vehicleData = {
        ...vehicle,
        images: vehicle.images ? JSON.parse(vehicle.images) : [],
        features: vehicle.features ? JSON.parse(vehicle.features) : []
      };

      return NextResponse.json({ 
        success: true, 
        vehicle: vehicleData 
      });
    }

    // Build where clause for filtering
    const where: any = {};
    
    if (type) {
      where.type = type;
    }
    
    if (available !== null && available !== undefined) {
      where.isAvailable = available === 'true';
    }

    if (minCapacity) {
      where.capacity = {
        gte: parseInt(minCapacity)
      };
    }

    if (maxPrice) {
      where.pricePerHour = {
        lte: parseFloat(maxPrice)
      };
    }

    // Get all vehicles with filters
    const vehicles = await prisma.vehicle.findMany({
      where,
      include: {
        driver: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true
              }
            }
          }
        }
      },
      orderBy: { 
        pricePerHour: 'asc' 
      }
    });

    // Parse JSON fields for all vehicles
    const vehiclesData = vehicles.map(vehicle => ({
      ...vehicle,
      images: vehicle.images ? JSON.parse(vehicle.images) : [],
      features: vehicle.features ? JSON.parse(vehicle.features) : []
    }));

    return NextResponse.json({ 
      success: true, 
      vehicles: vehiclesData,
      count: vehiclesData.length
    });

  } catch (error: any) {
    console.error('❌ Get vehicles error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch vehicles',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// POST - Create a new vehicle
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
      images = [],
      features = [],
      isADACompliant = false,
      licensePlate,
      driverId
    } = body;

    // Validate required fields
    if (!name || !type || !brand || !model || !year || !capacity || !luggageCapacity || !pricePerHour || !licensePlate) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: name, type, brand, model, year, capacity, luggageCapacity, pricePerHour, licensePlate are required'
      }, { status: 400 });
    }

    // Check if license plate already exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { licensePlate }
    });

    if (existingVehicle) {
      return NextResponse.json({
        success: false,
        message: 'Vehicle with this license plate already exists'
      }, { status: 409 });
    }

    // If driverId is provided, verify driver exists
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

      // Check if driver already has a vehicle
      const driverHasVehicle = await prisma.vehicle.findFirst({
        where: { driverId }
      });

      if (driverHasVehicle) {
        return NextResponse.json({
          success: false,
          message: 'Driver is already assigned to another vehicle'
        }, { status: 400 });
      }
    }

    // Create vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        name,
        type,
        brand,
        model,
        year: parseInt(year.toString()),
        capacity: parseInt(capacity.toString()),
        luggageCapacity: parseInt(luggageCapacity.toString()),
        pricePerHour: parseFloat(pricePerHour.toString()),
        images: JSON.stringify(images),
        features: JSON.stringify(features),
        isADACompliant,
        licensePlate,
        driverId: driverId || null,
        isAvailable: true
      },
      include: {
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
      }
    });

    // Parse JSON fields before returning
    const vehicleData = {
      ...vehicle,
      images: JSON.parse(vehicle.images),
      features: JSON.parse(vehicle.features)
    };

    return NextResponse.json({
      success: true,
      vehicle: vehicleData,
      message: 'Vehicle created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Create vehicle error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to create vehicle',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// PATCH - Update vehicle
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Vehicle ID is required'
      }, { status: 400 });
    }

    // Check if vehicle exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { id }
    });

    if (!existingVehicle) {
      return NextResponse.json({
        success: false,
        message: 'Vehicle not found'
      }, { status: 404 });
    }

    // If updating license plate, check for duplicates
    if (updateData.licensePlate && updateData.licensePlate !== existingVehicle.licensePlate) {
      const duplicatePlate = await prisma.vehicle.findUnique({
        where: { licensePlate: updateData.licensePlate }
      });

      if (duplicatePlate) {
        return NextResponse.json({
          success: false,
          message: 'Another vehicle with this license plate already exists'
        }, { status: 409 });
      }
    }

    // If updating driverId, verify driver exists and is not assigned to another vehicle
    if (updateData.driverId !== undefined && updateData.driverId !== null) {
      const driver = await prisma.driver.findUnique({
        where: { id: updateData.driverId }
      });

      if (!driver) {
        return NextResponse.json({
          success: false,
          message: 'Driver not found'
        }, { status: 404 });
      }

      // Check if driver is assigned to another vehicle
      const driverVehicle = await prisma.vehicle.findFirst({
        where: { 
          driverId: updateData.driverId,
          id: { not: id }
        }
      });

      if (driverVehicle) {
        return NextResponse.json({
          success: false,
          message: 'Driver is already assigned to another vehicle'
        }, { status: 400 });
      }
    }

    // Process update data
    const processedData: any = {};
    
    if (updateData.year !== undefined) processedData.year = parseInt(updateData.year.toString());
    if (updateData.capacity !== undefined) processedData.capacity = parseInt(updateData.capacity.toString());
    if (updateData.luggageCapacity !== undefined) processedData.luggageCapacity = parseInt(updateData.luggageCapacity.toString());
    if (updateData.pricePerHour !== undefined) processedData.pricePerHour = parseFloat(updateData.pricePerHour.toString());
    if (updateData.images !== undefined) processedData.images = JSON.stringify(updateData.images);
    if (updateData.features !== undefined) processedData.features = JSON.stringify(updateData.features);
    if (updateData.isAvailable !== undefined) processedData.isAvailable = updateData.isAvailable;
    if (updateData.isADACompliant !== undefined) processedData.isADACompliant = updateData.isADACompliant;
    if (updateData.driverId !== undefined) processedData.driverId = updateData.driverId;
    
    // Add simple string fields
    ['name', 'type', 'brand', 'model', 'licensePlate'].forEach(field => {
      if (updateData[field] !== undefined) processedData[field] = updateData[field];
    });

    // Update vehicle
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: processedData,
      include: {
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

    // Parse JSON fields before returning
    const vehicleData = {
      ...vehicle,
      images: vehicle.images ? JSON.parse(vehicle.images) : [],
      features: vehicle.features ? JSON.parse(vehicle.features) : []
    };

    return NextResponse.json({
      success: true,
      vehicle: vehicleData,
      message: 'Vehicle updated successfully'
    });

  } catch (error: any) {
    console.error('❌ Update vehicle error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to update vehicle',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// DELETE - Delete a vehicle
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Vehicle ID is required'
      }, { status: 400 });
    }

    // Check if vehicle exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        bookings: {
          where: {
            status: {
              in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
            }
          }
        }
      }
    });

    if (!existingVehicle) {
      return NextResponse.json({
        success: false,
        message: 'Vehicle not found'
      }, { status: 404 });
    }

    // Don't allow deletion if vehicle has active bookings
    if (existingVehicle.bookings.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Cannot delete vehicle with active bookings. Please complete or cancel all bookings first.'
      }, { status: 400 });
    }

    // Delete vehicle
    await prisma.vehicle.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });

  } catch (error: any) {
    console.error('❌ Delete vehicle error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to delete vehicle',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}