import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = await req.json();

    // Verify Razorpay signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    // Payment verified — create order in database
    await dbConnect();

    const order = await Order.create({
      id: 'ORD-' + Date.now().toString(36).toUpperCase(),
      customerName: orderData.customerName,
      email: orderData.email,
      phone: orderData.phone,
      address: orderData.address,
      items: orderData.items,
      total: orderData.total,
      status: 'processing',
      paymentMethod: 'razorpay',
      paymentId: razorpay_payment_id,
      date: new Date().toISOString().split('T')[0],
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Payment verified and order created',
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
