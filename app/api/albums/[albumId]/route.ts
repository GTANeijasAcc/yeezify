import { NextResponse } from 'next/server';
import { getAlbumById, updateAlbum } from '@/backend/db';

interface Params {
  params: { albumId: string };
}

export async function GET(_request: Request, { params }: Params) {
  const album = await getAlbumById(params.albumId);
  if (!album) {
    return NextResponse.json({ error: 'Album not found' }, { status: 404 });
  }
  return NextResponse.json(album);
}

export async function PUT(request: Request, { params }: Params) {
  const updates = await request.json();
  const album = await updateAlbum(params.albumId, updates);
  if (!album) {
    return NextResponse.json({ error: 'Album not found' }, { status: 404 });
  }
  return NextResponse.json(album);
}
