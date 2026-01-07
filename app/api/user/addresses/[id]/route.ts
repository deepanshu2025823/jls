// app/api/user/addresses/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const address = await prisma.savedAddress.findUnique({
      where: { id: params.id },
    });

    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    if (address.userId !== decoded.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await prisma.savedAddress.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Address deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}

// app/api/user/addresses/[id]/default/route.ts
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const address = await prisma.savedAddress.findUnique({
      where: { id: params.id },
    });

    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    if (address.userId !== decoded.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Unset other default addresses
    await prisma.savedAddress.updateMany({
      where: { userId: decoded.userId },
      data: { isDefault: false },
    });

    // Set this address as default
    const updatedAddress = await prisma.savedAddress.update({
      where: { id: params.id },
      data: { isDefault: true },
    });

    return NextResponse.json(updatedAddress, { status: 200 });
  } catch (error) {
    console.error('Error setting default address:', error);
    return NextResponse.json({ error: 'Failed to set default address' }, { status: 500 });
  }
}