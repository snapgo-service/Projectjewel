import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Admin sees all orders, regular users see only their own
    if (session.user.role === 'admin') {
      const orders = await Order.find({}).sort({ createdAt: -1 });
      return NextResponse.json(orders);
    }

    // Regular user: find orders by userId
    const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await auth();
    const body = await req.json();

    const { customerName, email, phone, address, items, total } = body;
    if (!customerName || !email || !phone || !address || !items || !Array.isArray(items) || !total) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check stock for all items
    const productIds = items.map((item: { productId: string }) => item.productId);
    const products = await Product.find({ id: { $in: productIds } });
    const outOfStock = items.filter((item: { productId: string; productName: string }) => {
      const product = products.find((p: { id: string }) => p.id === item.productId);
      return !product || !product.inStock;
    });

    if (outOfStock.length > 0) {
      const names = outOfStock.map((item: { productName: string }) => item.productName).join(', ');
      return NextResponse.json({ error: `Out of stock: ${names}` }, { status: 400 });
    }

    const id = 'ORD-' + Date.now().toString(36).toUpperCase();
    const order = await Order.create({
      id,
      userId: session?.user?.id || '',
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
