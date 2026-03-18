import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const orders = await Order.find({}).sort({ date: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const { customerName, email, phone, address, items, total } = body;
    if (!customerName || !email || !phone || !address || !items || !Array.isArray(items) || !total) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = 'ORD-' + Date.now().toString(36).toUpperCase();
    const order = await Order.create({
      id,
      customerName,
      email,
      phone,
      address,
      items,
      total,
      paymentMethod: body.paymentMethod || 'cod',
      paymentId: body.paymentId,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
