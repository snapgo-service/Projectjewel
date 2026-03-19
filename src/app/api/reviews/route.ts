import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import Order from '@/models/Order';

// GET reviews for a product
export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get('productId');
  if (!productId) {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 });
  }

  await dbConnect();
  const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
  return NextResponse.json(reviews);
}

// POST a new review
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'You must be logged in to submit a review' }, { status: 401 });
  }

  const { productId, rating, comment } = await req.json();
  if (!productId || !rating || !comment) {
    return NextResponse.json({ error: 'productId, rating, and comment are required' }, { status: 400 });
  }

  await dbConnect();

  // Check if user has purchased this product
  const order = await Order.findOne({
    email: session.user.email,
    'items.productId': productId,
    status: { $in: ['delivered', 'shipped', 'processing', 'pending'] },
  });

  if (!order) {
    return NextResponse.json({ error: 'You can only review products you have purchased' }, { status: 403 });
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({ productId, userId: session.user.id });
  if (existingReview) {
    return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 409 });
  }

  const review = await Review.create({
    productId,
    userId: session.user.id,
    userName: session.user.name || 'Anonymous',
    userEmail: session.user.email,
    rating: Math.min(5, Math.max(1, Number(rating))),
    comment,
  });

  // Update product rating and review count
  const allReviews = await Review.find({ productId });
  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  await Product.findOneAndUpdate(
    { id: productId },
    { rating: Math.round(avgRating * 10) / 10, reviewCount: allReviews.length }
  );

  return NextResponse.json(review, { status: 201 });
}
