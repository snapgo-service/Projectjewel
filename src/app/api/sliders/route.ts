import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Slider from '@/models/Slider';

export async function GET() {
  try {
    await dbConnect();
    const sliders = await Slider.find({}).sort({ order: 1 });
    return NextResponse.json(sliders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sliders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    const slider = await Slider.create({ ...body, id });
    return NextResponse.json(slider, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create slider' }, { status: 500 });
  }
}
