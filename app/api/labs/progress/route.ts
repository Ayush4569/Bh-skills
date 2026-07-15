import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import UserProgress from '@/models/userProgress';
import XPLog from '@/models/xpLog';
import Attempt from '@/models/attempt';
import Achievement from '@/models/achievement';
import Course from '@/models/course';
import Challenge from '@/models/challenge';

export async function GET() {
  try {
    await connectToDatabase();
    const userId = 'guest_user';

    // Fetch progress
    let progress = await UserProgress.findOne({ userId });
    if (!progress) {
      // Find first challenge of Web and Python courses
      const webCourse = await Course.findOne({ slug: 'web' });
      const pythonCourse = await Course.findOne({ slug: 'python' });

      let firstWebChallenge = null;
      let firstPyChallenge = null;

      if (webCourse) {
        const webModule = await Course.aggregate([
          { $match: { _id: webCourse._id } },
          { $lookup: { from: 'modules', localField: '_id', foreignField: 'courseId', as: 'modules' } }
        ]);
        if (webModule[0]?.modules?.length) {
          const modIds = webModule[0].modules.map((m: any) => m._id);
          const firstWeb = await Challenge.findOne({ moduleId: { $in: modIds } }).sort({ createdAt: 1 });
          if (firstWeb) firstWebChallenge = firstWeb._id;
        }
      }

      if (pythonCourse) {
        const pyModule = await Course.aggregate([
          { $match: { _id: pythonCourse._id } },
          { $lookup: { from: 'modules', localField: '_id', foreignField: 'courseId', as: 'modules' } }
        ]);
        if (pyModule[0]?.modules?.length) {
          const modIds = pyModule[0].modules.map((m: any) => m._id);
          const firstPy = await Challenge.findOne({ moduleId: { $in: modIds } }).sort({ createdAt: 1 });
          if (firstPy) firstPyChallenge = firstPy._id;
        }
      }

      const unlocked = [];
      if (firstWebChallenge) unlocked.push(firstWebChallenge);
      if (firstPyChallenge) unlocked.push(firstPyChallenge);

      progress = await UserProgress.create({
        userId,
        completedChallenges: [],
        unlockedChallenges: unlocked,
        xp: 0,
        currentLevel: 1,
      });
    }

    // Fetch recent XP logs
    const xpLogs = await XPLog.find({ userId }).sort({ createdAt: -1 }).limit(10);

    // Fetch attempts count
    const attempts = await Attempt.find({ userId });

    // Fetch all achievements
    const allAchievements = await Achievement.find({}).sort({ xpRequired: 1 });

    return NextResponse.json({
      progress,
      xpLogs,
      attemptsCount: attempts.length,
      allAchievements,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectToDatabase();
    const userId = 'guest_user';
    const body = await request.json();
    const { action } = body;

    if (action === 'reset') {
      // Clear logs
      await XPLog.deleteMany({ userId });
      await Attempt.deleteMany({ userId });

      // Find first challenge of Web and Python
      const courses = await Course.find({ slug: { $in: ['web', 'python'] } });
      const courseIds = courses.map((c) => c._id);
      
      const modules = await mongooseModelFindModules(courseIds);
      const firstChallenges = await Challenge.find({ moduleId: { $in: modules.map(m => m._id) } }).sort({ createdAt: 1 });
      
      // Get first challenge of web module 1 and python module 1
      const webFirst = firstChallenges.find(c => c.language !== 'python');
      const pyFirst = firstChallenges.find(c => c.language === 'python');

      const unlocked = [];
      if (webFirst) unlocked.push(webFirst._id);
      if (pyFirst) unlocked.push(pyFirst._id);

      const progress = await UserProgress.findOneAndUpdate(
        { userId },
        {
          $set: {
            completedChallenges: [],
            unlockedChallenges: unlocked,
            xp: 0,
            currentLevel: 1,
          },
        },
        { new: true, upsert: true }
      );

      return NextResponse.json({ success: true, progress });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper function to query modules of courses
async function mongooseModelFindModules(courseIds: any[]) {
  const Module = (await import('@/models/module')).default;
  return await Module.find({ courseId: { $in: courseIds } });
}
