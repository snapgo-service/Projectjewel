import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Review from '@/models/Review';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ canReview: false, reason: 'not_logged_in' });
  }

  const productId = req.nextUrl.searchParams.get('productId');
  if (!productId) {
    return NextResponse.json({ canReview: false, reason: 'no_product' });
  }

  await dbConnect();

  // Check if already reviewed
  const existingReview = await Review.findOne({ productId, userId: session.user.id });
  if (existingReview) {
    return NextResponse.json({ canReview: false, reason: 'already_reviewed' });
  }

  // Check if purchased
  const order = await Order.findOne({
    email: session.user.email,
    'items.productId': productId,
  });

  if (!order) {
    return NextResponse.json({ canReview: false, reason: 'not_purchased' });
  }

  return NextResponse.json({ canReview: true });
}
