// app/api/user/cards/[id]/default/route.ts
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

    const cardId = params.id;

    // Check if card exists and belongs to user
    const card = await prisma.savedCard.findUnique({
      where: { id: cardId },
    });

    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    if (card.userId !== decoded.userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Unset all other default cards for this user
    await prisma.savedCard.updateMany({
      where: { userId: decoded.userId },
      data: { isDefault: false },
    });

    // Set this card as default
    const updatedCard = await prisma.savedCard.update({
      where: { id: cardId },
      data: { isDefault: true },
    });

    return NextResponse.json(updatedCard, { status: 200 });
  } catch (error) {
    console.error('Error setting default card:', error);
    return NextResponse.json(
      { error: 'Failed to set default card' },
      { status: 500 }
    );
  }
}