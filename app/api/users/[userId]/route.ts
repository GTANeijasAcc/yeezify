import { NextResponse } from 'next/server';
import { getUserById } from '@/backend/db';

interface Params {
  params: { userId: string };
}

export async function GET(_request: Request, { params }: Params) {
  const user = await getUserById(params.userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(user);
}
