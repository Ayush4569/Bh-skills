import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Attempt from '@/models/attempt';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<any> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const { code } = body;

    const userId = 'guest_user';
    const attempt = await Attempt.findOneAndUpdate(
      { userId, challengeId: id },
      {
        $setOnInsert: { userId, challengeId: id, passed: false },
        $inc: { attempts: 1 },
        $set: { submittedCode: code, completedAt: new Date() }
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, attempt });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
