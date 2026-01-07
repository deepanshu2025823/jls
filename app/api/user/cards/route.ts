// app/api/user/cards/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET - Fetch all saved cards for the authenticated user
export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    console.log('Authorization header:', authHeader);
    console.log('Token:', token);

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      console.log('Decoded token:', decoded);
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Fetch all cards for the user
    const cards = await prisma.savedCard.findMany({
      where: { userId: decoded.userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ],
    });

    console.log('Fetched cards:', cards.length);

    return NextResponse.json(cards, { status: 200 });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
}

// POST - Create a new saved card
export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { cardLastFour, cardBrand, expiryMonth, expiryYear, isDefault } = body;

    // Validate required fields
    if (!cardLastFour || !cardBrand || !expiryMonth || !expiryYear) {
      return NextResponse.json(
        { error: 'All card fields are required' },
        { status: 400 }
      );
    }

    // If this card is set as default, unset other defaults
    if (isDefault) {
      await prisma.savedCard.updateMany({
        where: { userId: decoded.userId },
        data: { isDefault: false },
      });
    }

    // Create new saved card
    const card = await prisma.savedCard.create({
      data: {
        userId: decoded.userId,
        cardLastFour,
        cardBrand,
        expiryMonth: parseInt(expiryMonth),
        expiryYear: parseInt(expiryYear),
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json(
      { error: 'Failed to create card' },
      { status: 500 }
    );
  }
}