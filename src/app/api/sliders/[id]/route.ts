import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Slider from '@/models/Slider';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const body = await req.json();
    const slider = await Slider.findOneAndUpdate({ id }, body, { new: true });

    if (!slider) {
      return NextResponse.json({ error: 'Slider not found' }, { status: 404 });
    }

    return NextResponse.json(slider);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update slider' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const slider = await Slider.findOneAndDelete({ id });

    if (!slider) {
      return NextResponse.json({ error: 'Slider not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Slider deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete slider' }, { status: 500 });
  }
}
