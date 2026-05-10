import { NextRequest, NextResponse } from 'next/server';
import { createUser, getAllUsers, getUserByUsername } from '@/backend/db';

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username');
  if (username) {
    const user = await getUserByUsername(username);
    return NextResponse.json(user ?? { message: 'User not found' }, { status: user ? 200 : 404 });
  }
  const users = await getAllUsers();
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const username = typeof body?.username === 'string' ? body.username.trim() : '';
  if (!username) {
    return NextResponse.json({ error: 'username is required' }, { status: 400 });
  }
  const user = await createUser(username);
  return NextResponse.json(user, { status: 201 });
}
