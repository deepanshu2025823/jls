// ============================================
// app/api/user/cards/[id]/route.ts
// ============================================
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const cardId = params.id;

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

    const card = await prisma.savedCard.findUnique({
      where: { id: cardId },
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    if (card.userId !== decoded.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json(card, { status: 200 });
  } catch (error) {
    console.error('Error fetching card:', error);
    return NextResponse.json({ error: 'Failed to fetch card' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const cardId = params.id;

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

    const card = await prisma.savedCard.findUnique({
      where: { id: cardId },
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    if (card.userId !== decoded.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await prisma.savedCard.delete({
      where: { id: cardId },
    });

    return NextResponse.json({ message: 'Card deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting card:', error);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const cardId = params.id;

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

    const card = await prisma.savedCard.findUnique({
      where: { id: cardId },
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    if (card.userId !== decoded.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { cardLastFour, cardBrand, expiryMonth, expiryYear } = body;

    const updatedCard = await prisma.savedCard.update({
      where: { id: cardId },
      data: {
        ...(cardLastFour && { cardLastFour }),
        ...(cardBrand && { cardBrand }),
        ...(expiryMonth && { expiryMonth }),
        ...(expiryYear && { expiryYear }),
      },
    });

    return NextResponse.json(updatedCard, { status: 200 });
  } catch (error) {
    console.error('Error updating card:', error);
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
  }
}

// ============================================
// app/api/user/cards/[id]/default/route.ts
// ============================================
export async function PATCH_DEFAULT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const cardId = params.id;

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

    const card = await prisma.savedCard.findUnique({
      where: { id: cardId },
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    if (card.userId !== decoded.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await prisma.savedCard.updateMany({
      where: { userId: decoded.userId },
      data: { isDefault: false },
    });

    const updatedCard = await prisma.savedCard.update({
      where: { id: cardId },
      data: { isDefault: true },
    });

    return NextResponse.json(updatedCard, { status: 200 });
  } catch (error) {
    console.error('Error setting default card:', error);
    return NextResponse.json({ error: 'Failed to set default card' }, { status: 500 });
  }
}