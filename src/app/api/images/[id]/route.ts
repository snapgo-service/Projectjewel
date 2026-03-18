import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Image from '@/models/Image';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const image = await Image.findById(id);

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return new Response(image.data, {
      headers: {
        'Content-Type': image.contentType,
        'Content-Length': String(image.size),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load image' }, { status: 500 });
  }
}
