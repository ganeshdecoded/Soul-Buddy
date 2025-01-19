import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/astradb';

interface Params {
  userId: string;
}

export async function GET(
  request: NextRequest,
  context: { params: Params }
) {
  try {
    const userId = await Promise.resolve(context.params.userId);
    const db = await getDb();
    const users = db.collection('users');
    
    const user = await users.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user.horoscope || {});
  } catch (error: any) {
    console.error('Error fetching horoscope:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch horoscope' },
      { status: 500 }
    );
  }
}