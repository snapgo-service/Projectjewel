import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const order = await Order.findOne({ id });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const body = await req.json();

    // Non-admin users can cancel or request return/exchange
    if (session.user.role !== 'admin') {
      const order = await Order.findOne({ id });
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      if (order.userId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Cancel: only for pending/processing orders
      if (body.status === 'cancelled') {
        if (order.status === 'shipped' || order.status === 'delivered' || order.status === 'return_requested' || order.status === 'returned') {
          return NextResponse.json({ error: 'Cannot cancel this order' }, { status: 400 });
        }
        order.status = 'cancelled';
        await order.save();
        return NextResponse.json(order);
      }

      // Return/Exchange: only for delivered orders
      if (body.status === 'return_requested') {
        if (order.status !== 'delivered') {
          return NextResponse.json({ error: 'Return/Exchange can only be requested for delivered orders' }, { status: 400 });
        }
        order.status = 'return_requested';
        if (body.returnReason) order.set('returnReason', body.returnReason);
        await order.save();
        return NextResponse.json(order);
      }

      return NextResponse.json({ error: 'Invalid action' }, { status: 403 });
    }

    // Admin can update anything
    const order = await Order.findOneAndUpdate({ id }, body, { new: true });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
