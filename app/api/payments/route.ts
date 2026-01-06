import { dbConfig } from '@/lib/db';
// app/api/payments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Process a new payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      bookingId,
      amount,
      tipAmount = 0,
      paymentMethod,
      cardDetails,
      saveCard = false,
      userId
    } = body;

    // Validate required fields
    if (!bookingId || !amount || !paymentMethod) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: bookingId, amount, and paymentMethod are required'
      }, { status: 400 });
    }

    // Verify booking exists
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        vehicle: true
      }
    });

    if (!booking) {
      return NextResponse.json({
        success: false,
        message: 'Booking not found'
      }, { status: 404 });
    }

    // Check if booking is already paid
    if (booking.isPaid) {
      return NextResponse.json({
        success: false,
        message: 'Booking is already paid'
      }, { status: 400 });
    }

    // Verify amount matches booking total
    const expectedTotal = booking.totalPrice + parseFloat(tipAmount.toString());
    const providedTotal = parseFloat(amount.toString()) + parseFloat(tipAmount.toString());
    
    if (Math.abs(expectedTotal - providedTotal) > 0.01) {
      return NextResponse.json({
        success: false,
        message: `Payment amount mismatch. Expected: $${expectedTotal.toFixed(2)}, Provided: $${providedTotal.toFixed(2)}`
      }, { status: 400 });
    }

    // Generate unique transaction ID
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11).toUpperCase();
    const transactionId = `TXN${timestamp}${random}`;

    // Process payment in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create payment record
      const payment = await tx.payment.create({
        data: {
          bookingId,
          amount: parseFloat(amount.toString()),
          tipAmount: parseFloat(tipAmount.toString()),
          paymentMethod,
          transactionId,
          status: 'completed',
          paidAt: new Date()
        }
      });

      // Update booking status
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          isPaid: true,
          tipAmount: parseFloat(tipAmount.toString()),
          status: 'CONFIRMED'
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
              name: true,
              type: true,
              brand: true,
              model: true
            }
          }
        }
      });

      // Save card if requested
      if (saveCard && cardDetails && userId) {
        try {
          // Check how many cards user has
          const existingCardsCount = await tx.savedCard.count({
            where: { userId }
          });

          // Verify user exists
          const user = await tx.user.findUnique({
            where: { id: userId }
          });

          if (user) {
            await tx.savedCard.create({
              data: {
                userId,
                cardLastFour: cardDetails.cardNumber.replace(/\s/g, '').slice(-4),
                cardBrand: detectCardBrand(cardDetails.cardNumber),
                expiryMonth: parseInt(cardDetails.expiryDate.split('/')[0]),
                expiryYear: parseInt('20' + cardDetails.expiryDate.split('/')[1]),
                isDefault: existingCardsCount === 0
              }
            });
          }
        } catch (cardError) {
          console.error('Error saving card:', cardError);
          // Continue even if card save fails
        }
      }

      return {
        payment,
        booking: updatedBooking
      };
    });

    return NextResponse.json({
      success: true,
      payment: result.payment,
      booking: result.booking,
      message: 'Payment processed successfully'
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Payment processing error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Payment processing failed',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// GET - Retrieve payment information
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');
    const userId = searchParams.get('userId');
    const transactionId = searchParams.get('transactionId');

    // Get payment by booking ID
    if (bookingId) {
      const payment = await prisma.payment.findUnique({
        where: { bookingId },
        include: {
          booking: {
            include: {
              vehicle: {
                select: {
                  name: true,
                  type: true,
                  brand: true,
                  model: true
                }
              },
              customer: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true
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
              }
            }
          }
        }
      });

      if (!payment) {
        return NextResponse.json({
          success: false,
          message: 'Payment not found for this booking'
        }, { status: 404 });
      }

      return NextResponse.json({ 
        success: true, 
        payment 
      });
    }

    // Get payment by transaction ID
    if (transactionId) {
      const payment = await prisma.payment.findFirst({
        where: { transactionId },
        include: {
          booking: {
            include: {
              customer: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          }
        }
      });

      if (!payment) {
        return NextResponse.json({
          success: false,
          message: 'Payment not found with this transaction ID'
        }, { status: 404 });
      }

      return NextResponse.json({ 
        success: true, 
        payment 
      });
    }

    // Get all payments for a user
    if (userId) {
      const payments = await prisma.payment.findMany({
        where: {
          booking: {
            customerId: userId
          }
        },
        include: {
          booking: {
            select: {
              id: true,
              bookingNumber: true,
              pickupLocation: true,
              dropLocation: true,
              pickupDate: true,
              pickupTime: true,
              status: true,
              totalPrice: true,
              vehicle: {
                select: {
                  name: true,
                  type: true
                }
              }
            }
          }
        },
        orderBy: { 
          createdAt: 'desc' 
        }
      });

      return NextResponse.json({ 
        success: true, 
        payments,
        count: payments.length
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Missing required parameters. Provide bookingId, transactionId, or userId'
    }, { status: 400 });

  } catch (error: any) {
    console.error('❌ Get payment error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch payment',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// PATCH - Update payment status (for refunds, etc.)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, status, refundAmount } = body;

    if (!paymentId) {
      return NextResponse.json({
        success: false,
        message: 'Payment ID is required'
      }, { status: 400 });
    }

    const updateData: any = {};
    
    if (status) {
      updateData.status = status;
    }

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: updateData,
      include: {
        booking: {
          select: {
            bookingNumber: true,
            customer: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      payment,
      message: 'Payment updated successfully'
    });

  } catch (error: any) {
    console.error('❌ Update payment error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to update payment',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// Helper function to detect card brand from card number
function detectCardBrand(cardNumber: string): string {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  
  // Visa
  if (/^4/.test(cleaned)) {
    return 'Visa';
  }
  
  // Mastercard
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) {
    return 'Mastercard';
  }
  
  // American Express
  if (/^3[47]/.test(cleaned)) {
    return 'American Express';
  }
  
  // Discover
  if (/^6(?:011|5)/.test(cleaned)) {
    return 'Discover';
  }
  
  // JCB
  if (/^35/.test(cleaned)) {
    return 'JCB';
  }
  
  // Maestro
  if (/^(5018|5020|5038|6304|6759|6761|6763)/.test(cleaned)) {
    return 'Maestro';
  }
  
  // Diners Club
  if (/^3(?:0[0-5]|[68])/.test(cleaned)) {
    return 'Diners Club';
  }
  
  return 'Unknown';
}
