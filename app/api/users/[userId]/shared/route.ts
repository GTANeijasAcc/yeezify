import { NextRequest, NextResponse } from 'next/server';
import { getSharedAlbumsForUser, getUserById } from '@/backend/db';

export async function GET(_request: NextRequest, context: { params: Promise<{ userId: string }> }) {
  const { userId } = await context.params;
  const user = await getUserById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const shared = await getSharedAlbumsForUser(userId);
  return NextResponse.json(shared);
}
