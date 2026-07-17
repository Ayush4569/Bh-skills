import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Challenge from '@/models/challenge';
import UserProgress from '@/models/userProgress';
import Attempt from '@/models/attempt';
import XPLog from '@/models/xpLog';
import Achievement from '@/models/achievement';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<any> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const { code, passed, skip } = body;

    const userId = 'guest_user';

    // 1. Verify challenge exists
    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    // 2. Fetch or create user progress
    let progress = await UserProgress.findOne({ userId });
    if (!progress) {
      progress = await UserProgress.create({
        userId,
        completedChallenges: [],
        unlockedChallenges: [challenge._id],
        xp: 0,
        currentLevel: 1,
      });
    }

    // 3. Save Attempt
    await Attempt.findOneAndUpdate(
      { userId, challengeId: id },
      {
        $set: { submittedCode: code || '', passed: passed || skip || false, completedAt: new Date() },
        $inc: { attempts: 1 }
      },
      { upsert: true }
    );

    let xpGained = 0;
    let newlyCompleted = false;

    if (passed || skip) {
      // Check if already completed
      const isAlreadyCompleted = progress.completedChallenges.some(
        (cId: any) => cId.toString() === id
      );

      if (!isAlreadyCompleted) {
        newlyCompleted = true;
        xpGained = skip ? 0 : challenge.xp;

        // Update arrays in progress
        progress.completedChallenges.push(challenge._id);
        
        if (xpGained > 0) {
          progress.xp += xpGained;

          // Level formula: 150 XP per level (level = floor(xp / 150) + 1)
          const newLevel = Math.floor(progress.xp / 150) + 1;
          progress.currentLevel = newLevel;

          // Log XP
          await XPLog.create({
            userId,
            amount: xpGained,
            reason: `Completed Challenge: ${challenge.title}`,
          });
        } else if (skip) {
          // Log Skip
          await XPLog.create({
            userId,
            amount: 0,
            reason: `Skipped Challenge: ${challenge.title}`,
          });
        }

        // Unlock next challenge if applicable
        if (challenge.nextChallengeId) {
          const isNextUnlocked = progress.unlockedChallenges.some(
            (cId: any) => cId.toString() === challenge.nextChallengeId.toString()
          );
          if (!isNextUnlocked) {
            progress.unlockedChallenges.push(challenge.nextChallengeId);
          }
        }

        await progress.save();
      }
    }

    // Query unlocked achievements based on new XP
    const achievements = await Achievement.find({ xpRequired: { $lte: progress.xp } });

    return NextResponse.json({
      success: true,
      xpGained,
      newlyCompleted,
      progress: {
        xp: progress.xp,
        currentLevel: progress.currentLevel,
        completedChallenges: progress.completedChallenges,
        unlockedChallenges: progress.unlockedChallenges,
      },
      achievements,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
