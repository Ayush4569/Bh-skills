import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Challenge from '@/models/challenge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<any> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    let isTopicEnd = false;
    if (!challenge.nextChallengeId) {
      isTopicEnd = true;
    } else {
      const nextChallenge = await Challenge.findById(challenge.nextChallengeId);
      if (nextChallenge && nextChallenge.language !== challenge.language) {
        isTopicEnd = true;
      }
    }

    return NextResponse.json({
      ...challenge.toObject(),
      isTopicEnd,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

