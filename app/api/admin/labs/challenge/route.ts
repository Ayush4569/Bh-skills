import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Challenge from '@/models/challenge';
import Module from '@/models/module'; // Register Module model

export async function GET() {
  try {
    await connectToDatabase();
    const challenges = await Challenge.find({})
      .populate('moduleId', 'title')
      .sort({ createdAt: -1 });
    return NextResponse.json(challenges);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const {
      moduleId,
      title,
      description,
      language,
      difficulty,
      xp,
      starterCode,
      solution,
      validationRules,
      hints,
      nextChallengeId,
      published,
    } = body;

    if (!moduleId || !title || !description || !language || !difficulty) {
      return NextResponse.json({ error: 'moduleId, title, description, language, and difficulty are required' }, { status: 400 });
    }

    const challenge = await Challenge.create({
      moduleId,
      title,
      description,
      language,
      difficulty,
      xp: xp || 20,
      starterCode: starterCode || '',
      solution: solution || '',
      validationRules: validationRules || [],
      hints: hints || [],
      nextChallengeId: nextChallengeId || null,
      published: published !== undefined ? published : false,
    });

    return NextResponse.json({ success: true, challenge });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

