import { NextResponse } from 'next/server';
import { shareAlbum, getAlbumById } from '@/backend/db';

interface Params {
  params: { albumId: string };
}

export async function POST(request: Request, { params }: Params) {
  const body = await request.json();
  const toUserId = typeof body?.toUserId === 'string' ? body.toUserId : '';
  const album = await getAlbumById(params.albumId);
  if (!album) {
    return NextResponse.json({ error: 'Album not found' }, { status: 404 });
  }
  if (!toUserId) {
    return NextResponse.json({ error: 'toUserId is required' }, { status: 400 });
  }
  const shared = await shareAlbum(params.albumId, toUserId);
  if (!shared) {
    return NextResponse.json({ error: 'Unable to share album. Check user and album IDs.' }, { status: 400 });
  }
  return NextResponse.json(shared);
}
