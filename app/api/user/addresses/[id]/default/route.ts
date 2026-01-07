// app/api/user/addresses/[id]/default/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const addressId = params.id;

    // Check if address exists and belongs to user
    const address = await prisma.savedAddress.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    if (address.userId !== decoded.userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Unset all other default addresses for this user
    await prisma.savedAddress.updateMany({
      where: { userId: decoded.userId },
      data: { isDefault: false },
    });

    // Set this address as default
    const updatedAddress = await prisma.savedAddress.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    return NextResponse.json(updatedAddress, { status: 200 });
  } catch (error) {
    console.error('Error setting default address:', error);
    return NextResponse.json(
      { error: 'Failed to set default address' },
      { status: 500 }
    );
  }
}