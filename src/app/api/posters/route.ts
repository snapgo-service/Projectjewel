import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Poster from '@/models/Poster';

export async function GET() {
  try {
    await dbConnect();
    const posters = await Poster.find({}).sort({ order: 1 });
    return NextResponse.json(posters);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posters' }, { status: 500 });
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
    const poster = await Poster.create({ ...body, id });
    return NextResponse.json(poster, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create poster' }, { status: 500 });
  }
}
