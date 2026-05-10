import { NextRequest, NextResponse } from 'next/server';
import { getAlbumById, updateAlbum } from '@/backend/db';

export async function GET(_request: NextRequest, context: { params: Promise<{ albumId: string }> }) {
  const { albumId } = await context.params;
  const album = await getAlbumById(albumId);
  if (!album) {
    return NextResponse.json({ error: 'Album not found' }, { status: 404 });
  }
  return NextResponse.json(album);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ albumId: string }> }) {
  const updates = await request.json();
  const { albumId } = await context.params;
  const album = await updateAlbum(albumId, updates);
  if (!album) {
    return NextResponse.json({ error: 'Album not found' }, { status: 404 });
  }
  return NextResponse.json(album);
}
