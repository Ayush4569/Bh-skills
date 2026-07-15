import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Course from '@/models/course';
import Module from '@/models/module';
import Challenge from '@/models/challenge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<any> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    // Find course by slug
    const course = await Course.findOne({ slug });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Find all modules for this course, sorted by order
    const modules = await Module.find({ courseId: course._id }).sort({ order: 1 });
    const moduleIds = modules.map((m) => m._id);

    // Find all challenges for these modules, sorted by order/createdAt
    const challenges = await Challenge.find({
      moduleId: { $in: moduleIds },
      published: true,
    }).sort({ createdAt: 1 });

    // Group challenges by module ID
    const modulesWithChallenges = modules.map((mod) => {
      const modChallenges = challenges.filter(
        (chal) => chal.moduleId.toString() === mod._id.toString()
      );
      return {
        ...mod.toObject(),
        challenges: modChallenges.map((c) => ({
          _id: c._id,
          title: c.title,
          difficulty: c.difficulty,
          language: c.language,
          xp: c.xp,
          nextChallengeId: c.nextChallengeId,
        })),
      };
    });

    return NextResponse.json({
      course,
      modules: modulesWithChallenges,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
